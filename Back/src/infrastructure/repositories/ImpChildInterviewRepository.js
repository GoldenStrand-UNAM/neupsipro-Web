
const db = require('../database/database');
const ChildInterviewRepository = require('../../domain/repository/childInterviewRepository');

class ImpChildInterviewRepository extends ChildInterviewRepository {

  // HELPERS
  async fetchRefNum ({ id_user }) {
    return await db.query(
      `SELECT reference_number FROM user_info WHERE id_user = ?`,
      [id_user]
    );
  }

  async fetchRelation ({ id_user }) {
    return await db.query(
      `SELECT id_user_relation FROM user_relation WHERE id_user = ?`,
      [id_user]
    );
  }

  async fetchInterviewProgress ({ id_user_relation }) {
    return await db.query(
      `SELECT * FROM initial_interview_progress WHERE id_user_relation = ?`,
      [id_user_relation]
    );
  }

  async ensureRow ({ connection, id_user_relation }) {
    const conn = connection || db;
    await conn.query(
      `INSERT INTO child_interview (id_user_relation)
       VALUES (?)
       ON DUPLICATE KEY UPDATE id_user_relation = id_user_relation`,
      [id_user_relation]
    );
  }

 // Getters
  async fetchIdentification ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT full_name, bmi, schooling, school_name, ocupation, laterality,
              medical_eligibility,
              mothers_name, mothers_age, mothers_schooling, mothers_profession, mothers_occpation,
              fathers_name, fathers_age, fathers_schooling, fathers_profession, fathers_occupation,
              marital_status, religion, parental_authority, separation_age, number_siblings
         FROM child_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchSiblings ({ id_user }) {
    const [rows] = await db.query(
      `SELECT sibling_name, age, schooling, school_occupation
         FROM sibling
        WHERE id_user = ?`,
      [id_user]
    );
    return rows;
  }

  async fetchHeredofamilial ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT neurological, psychiatric, drug_addictions, law_conduct,
              cognitive_development, speech, similar_familiar
         FROM child_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchPathological ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT tbi, hospitalized, seizure, infectious, alergies, intoxication
         FROM child_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchPrenatal ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT not_gestate, misscarriage_number, csection, labors, wanted, planned,
              moms_age, dads_age, conceive_dif, conception_type, obstetric_surveillance,
              control_numbers, abortion_risk, premature_risk, emotional_state,
              feeding, diseases, medications, exposures
         FROM child_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchDevelopment ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT babbling_age, first_word_age, first_word, first_sentence, talk_strangers,
              language_pairs, expressed_ideas, spoken_comprehension, lenguaje_therapy, therapy_info,
              head_support, turn, seating, crawl, standing, motion, practices_sports, trimming,
              letter_legibility, motor_coordination, bicyle, movement_problems,
              temper, social_smile, object_permanence, affection_demonstration, conduct_strangers,
              childs_conduct, has_friends, friends_to_home, invited_to_party, other_sex_interest,
              how_plays, freetime_activity, electronics, follows_games_rules, new_situation_adaptation
         FROM child_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchBehavior ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT by_themselves_age, helps_at_home, to_do,
              how_eats, daily_meals, picky_eater, food_not_consumed, non_food_substances,
              feeding_behavior, sleep_routine, sleep_hours, continuous_sleep, naps,
              sph_control_age, sph_method, daytime_sph_ctrl_age, sph_regression,
              type_home_discipline, authority_figure, dis_scolding, dis_physical_punishment,
              dis_timeout, dis_treat, dis_convincing, dis_other, resp_dis_methods,
              acuerdo_cons_partner, dis_area_challenges
         FROM child_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchSchoolHistory ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT school_starting_age, school_performance, preschool, primary_school,
              junior_high, highschool, school_interest, school_aptitudes,
              failed_year, particular_classes, part_classes_time, extracur_act
         FROM child_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchPhysicalExam ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT weight, size, wc, temperature, bp, oxygenation, alergies_dermatitis,
              functional_support, good_hearing, concern_listen, audiometry,
              sees_well, needs_glasses, result
         FROM child_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  // Builds a dynamic UPDATE clause based on the fields received
  // Excludes "siblings" because sibling data is stored in a separate table
  _buildUpdate (data) {
    // Filter out fields that are not part of the child_interview table
    const cols = Object.keys(data).filter(k => k !== 'siblings');
    // If no valid fields, return empty clause
    const setClause = cols.map(c => `${c} = ?`).join(', ');
    // Map the values in the same order as the columns
    const values = cols.map(c => data[c]);

    return { setClause, values };
  }

  // Updates only the columns of the child_interview table provided in the current section.
  // Uses the dynamic SET clause generated by _buildUpdate().
  async _updateSection ({ connection, id_user_relation, data }) {
    const { setClause, values } = this._buildUpdate(data);
    if (!setClause) return;
    await connection.query(
      `UPDATE child_interview SET ${setClause} WHERE id_user_relation = ?`,
      [...values, id_user_relation]
    );
  }

  // Replace the siblinggs of the users
  async _saveSiblings ({ connection, id_user, siblings }) {
    await connection.query(
      `DELETE FROM sibling WHERE id_user = ?`,
      [id_user]
    );
    // Insert new siblings
    for (const s of siblings) {
      if (!s.sibling_name) continue;
      await connection.query(
        `INSERT INTO sibling (id_sibling, id_user, sibling_name, age, schooling, school_occupation)
         VALUES (UUID(), ?, ?, ?, ?, ?)`,
        [id_user, s.sibling_name, s.age, s.schooling, s.school_occupation]
      );
    }
  }

  //  progress 
  async updateSymptomsProgress ({ id_user_relation, completed }) {
    return await db.query(
      `UPDATE initial_interview_progress
          SET symptoms_completed = ?
        WHERE id_user_relation = ?`,
      [completed ? 1 : 0, id_user_relation]
    );
  }

  async updateInterviewProgress ({ id_user_relation, status }) {
    return await db.query(
      `UPDATE initial_interview_progress
          SET status = ?
        WHERE id_user_relation = ?`,
      [status, id_user_relation]
    );
  }

  // main patch
  async saveChildSection ({ subStep, id_user, id_user_relation, data }) {

    const connection = await db.getConnection();

    try {
      // Start transaction
      await connection.beginTransaction();

      await this.ensureRow({ connection, id_user_relation });

      await this._updateSection({ connection, id_user_relation, data });
 
      if (Number(subStep) === 1) {
        await this._saveSiblings({
          connection,
          id_user,
          siblings: data.siblings || [],
        });
      }

      await connection.commit();
      return { saved: true };

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

module.exports = ImpChildInterviewRepository;