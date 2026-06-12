
const db = require('../database/database');
const ClinicalInterviewRepository = require('../../domain/repository/clinicalInterviewRepository');


class ImpClinicalInterviewRepository extends ClinicalInterviewRepository {

  // Nreference_number
  async fetchRefNum ({ id_user }) {
    return await db.query(
      `SELECT reference_number
         FROM user_info
        WHERE id_user = ?`,
      [id_user]
    );
  }

  // get user relation
  async fetchRelation ({ id_user }) {
    return await db.query(
      `SELECT id_user_relation
         FROM user_relation
        WHERE id_user = ?`,
      [id_user]
    );
  }

  // initial interview progress
  async fetchInterviewProgress ({ id_user_relation }) {
    return await db.query(
      `SELECT *
         FROM initial_interview_progress
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
  }


  // Recompute inclusion_total as the sum of all 7 inclusion-criteria scores
  // currently stored on the row, after any individual score_* save
  async _recomputeInclusionTotal ({ connection, id_user_relation }) {
    await connection.query(
      `UPDATE initial_interview
          SET inclusion_total = COALESCE(score_age, 0) + COALESCE(score_schooling, 0)
                               + COALESCE(score_vision, 0) + COALESCE(score_hearing, 0)
                               + COALESCE(score_moca, 0) + COALESCE(score_psychiatric, 0)
                               + COALESCE(score_drug_use, 0)
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
  }

  // section fetcher helper
  async ensureRow ({ connection, id_user_relation }) {
    const conn = connection || db;
    await conn.query(
      `INSERT INTO clinical_interview (id_user_relation)
       VALUES (?)
       ON DUPLICATE KEY UPDATE id_user_relation = id_user_relation`,
      [id_user_relation]
    );
  }

  // ================= GET Functions ==========

  async fetchPhysicalConcerns ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT headache, dizziness, nausea_vomiting,
              urinary_inconsistency, intestinal_problem, skin_problem
         FROM clinical_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchMotor ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT weakness, movement_problem, tremor,
              tics, balance_problems, falls
         FROM clinical_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  async fetchSensory ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT sensation_loss, vision_dif, wears_glasses, blurry_vision,
              hearing_loss, ringing_ears, pain,
              phantom_limb, phantom_limb_desc,
              phantom_limb_pain, phantom_limb_pain_desc
         FROM clinical_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    const [scoreRows] = await db.query(
      `SELECT score_vision, score_hearing, inclusion_total
         FROM initial_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return { ...(rows[0] || {}), ...(scoreRows[0] || {}) };
  }

  async fetchMentalFunctions ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT cdr_result, nihss_result, mental_observation
         FROM clinical_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    const [scoreRows] = await db.query(
      `SELECT score_moca, score_psychiatric, inclusion_total
         FROM initial_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return { ...(rows[0] || {}), ...(scoreRows[0] || {}) };
  }

  async fetchPersonality ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT depression, anxiety, stress, sleeping_problems,
              easily_angry, very_emotional, frustrated_easily, changes_comments,
              family_problem, legal_problem, legal_problem_desc,
              finance_problem, driving_problem, control_problems,
              psychology_notes
         FROM clinical_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    const [scoreRows] = await db.query(
      `SELECT score_psychiatric
         FROM initial_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return { ...(rows[0] || {}), ...(scoreRows[0] || {}) };
  }

  async fetchSubstanceUse ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT drug_consumption, cigarette_consumption, alcohol_consumption,
              has_attended_therapy, therapy_type, therapy_duration,
              positive_experience, future_goals, observations
         FROM clinical_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    const [scoreRows] = await db.query(
      `SELECT score_drug_use, inclusion_total
         FROM initial_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return { ...(rows[0] || {}), ...(scoreRows[0] || {}) };
  }

  async fetchCalculators ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT cardiovascular_risk, qstroke_result, diabetes_risk,
              calc_analysis, inclusion_criteria
         FROM clinical_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    const [scoreRows] = await db.query(
      `SELECT inclusion_total
         FROM initial_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return { ...(rows[0] || {}), ...(scoreRows[0] || {}) };
  }

  async fetchFollowUp ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT initial_consultation, follow_up_notes
         FROM clinical_interview
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
    return rows[0] || {};
  }

  // ====================== POST  Functions =====================
  async _savePhysicalConcerns ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE clinical_interview
          SET headache = ?, dizziness = ?, nausea_vomiting = ?,
              urinary_inconsistency = ?, intestinal_problem = ?, skin_problem = ?
        WHERE id_user_relation = ?`,
      [
        data.headache, data.dizziness, data.nausea_vomiting,
        data.urinary_inconsistency, data.intestinal_problem, data.skin_problem,
        id_user_relation,
      ]
    );
  }

  async _saveMotor ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE clinical_interview
          SET weakness = ?, movement_problem = ?, tremor = ?,
              tics = ?, balance_problems = ?, falls = ?
        WHERE id_user_relation = ?`,
      [
        data.weakness, data.movement_problem, data.tremor,
        data.tics, data.balance_problems, data.falls,
        id_user_relation,
      ]
    );
  }

  async _saveSensory ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE clinical_interview
          SET sensation_loss = ?, vision_dif = ?, wears_glasses = ?, blurry_vision = ?,
              hearing_loss = ?, ringing_ears = ?, pain = ?,
              phantom_limb = ?, phantom_limb_desc = ?,
              phantom_limb_pain = ?, phantom_limb_pain_desc = ?
        WHERE id_user_relation = ?`,
      [
        data.sensation_loss, data.vision_dif, data.wears_glasses, data.blurry_vision,
        data.hearing_loss, data.ringing_ears, data.pain,
        data.phantom_limb, data.phantom_limb_desc,
        data.phantom_limb_pain, data.phantom_limb_pain_desc,
        id_user_relation,
      ]
    );

    await connection.query(
      `INSERT INTO initial_interview (id_user_relation, interview_date, score_vision, score_hearing)
       VALUES (?, CURRENT_DATE, ?, ?)
       ON DUPLICATE KEY UPDATE
           score_vision = VALUES(score_vision),
           score_hearing = VALUES(score_hearing)`,
      [id_user_relation, data.score_vision, data.score_hearing]
    );

    await this._recomputeInclusionTotal({ connection, id_user_relation });
  }

  async _saveMentalFunctions ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE clinical_interview
          SET cdr_result = ?, nihss_result = ?, mental_observation = ?
        WHERE id_user_relation = ?`,
      [
        data.cdr_result, data.nihss_result, data.mental_observation,
        id_user_relation,
      ]
    );

    await connection.query(
      `INSERT INTO initial_interview (id_user_relation, interview_date, score_moca)
       VALUES (?, CURRENT_DATE, ?)
       ON DUPLICATE KEY UPDATE
           score_moca = VALUES(score_moca)`,
      [id_user_relation, data.score_moca]
    );

    await this._recomputeInclusionTotal({ connection, id_user_relation });
  }

  async _savePersonality ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE clinical_interview
          SET depression = ?, anxiety = ?, stress = ?, sleeping_problems = ?,
              easily_angry = ?, very_emotional = ?, frustrated_easily = ?, changes_comments = ?,
              family_problem = ?, legal_problem = ?, legal_problem_desc = ?,
              finance_problem = ?, driving_problem = ?, control_problems = ?,
              psychology_notes = ?
        WHERE id_user_relation = ?`,
      [
        data.depression, data.anxiety, data.stress, data.sleeping_problems,
        data.easily_angry, data.very_emotional, data.frustrated_easily, data.changes_comments,
        data.family_problem, data.legal_problem, data.legal_problem_desc,
        data.finance_problem, data.driving_problem, data.control_problems,
        data.psychology_notes,
        id_user_relation,
      ]
    );

    await connection.query(
      `INSERT INTO initial_interview (id_user_relation, interview_date, score_psychiatric)
       VALUES (?, CURRENT_DATE, ?)
       ON DUPLICATE KEY UPDATE
           score_psychiatric = VALUES(score_psychiatric)`,
      [id_user_relation, data.score_psychiatric]
    );

    await this._recomputeInclusionTotal({ connection, id_user_relation });
  }

  async _saveSubstanceUse ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE clinical_interview
          SET drug_consumption = ?, cigarette_consumption = ?, alcohol_consumption = ?,
              has_attended_therapy = ?, therapy_type = ?, therapy_duration = ?,
              positive_experience = ?, future_goals = ?, observations = ?
        WHERE id_user_relation = ?`,
      [
        data.drug_consumption, data.cigarette_consumption, data.alcohol_consumption,
        data.has_attended_therapy, data.therapy_type, data.therapy_duration,
        data.positive_experience, data.future_goals, data.observations,
        id_user_relation,
      ]
    );

    await connection.query(
      `INSERT INTO initial_interview (id_user_relation, interview_date, score_drug_use)
       VALUES (?, CURRENT_DATE, ?)
       ON DUPLICATE KEY UPDATE
           score_drug_use = VALUES(score_drug_use)`,
      [id_user_relation, data.score_drug_use]
    );

    await this._recomputeInclusionTotal({ connection, id_user_relation });
  }

  async _saveCalculators ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE clinical_interview
          SET cardiovascular_risk = ?, qstroke_result = ?, diabetes_risk = ?,
              calc_analysis = ?, inclusion_criteria = ?
        WHERE id_user_relation = ?`,
      [
        data.cardiovascular_risk, data.qstroke_result, data.diabetes_risk,
        data.calc_analysis, data.inclusion_criteria,
        id_user_relation,
      ]
    );
  }

  async _saveFollowUp ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE clinical_interview
          SET initial_consultation = ?, follow_up_notes = ?
        WHERE id_user_relation = ?`,
      [
        data.initial_consultation, data.follow_up_notes,
        id_user_relation,
      ]
    );
  }

  // Progress update
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
  async saveClinicalSection ({ subStep, id_user_relation, data }) {

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // ensure row exists
      await this.ensureRow({ connection, id_user_relation });

      switch (subStep) {
        case 1:
          await this._savePhysicalConcerns({ connection, id_user_relation, data });
          break;
        case 2:
          await this._saveMotor({ connection, id_user_relation, data });
          break;
        case 3:
          await this._saveSensory({ connection, id_user_relation, data });
          break;
        case 4:
          await this._saveMentalFunctions({ connection, id_user_relation, data });
          break;
        case 5:
          await this._savePersonality({ connection, id_user_relation, data });
          break;
        case 6:
          await this._saveSubstanceUse({ connection, id_user_relation, data });
          break;
        case 7:
          await this._saveCalculators({ connection, id_user_relation, data });
          break;
        case 8:
          await this._saveFollowUp({ connection, id_user_relation, data });
          break;
        default:
          throw new Error('Invalid section');
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

module.exports = ImpClinicalInterviewRepository;