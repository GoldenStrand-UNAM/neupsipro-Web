const db = require ('../database/database');
const ImpIdentificationInterviewRepository = require('../../domain/repository/ImpIdentificationInterviewRepository');
const { safeDecrypt } = require('../crypt/profile/getProfile');

class IdentificationInterviewRepository extends ImpIdentificationInterviewRepository {

  // ----- Auxiliar functions -------------------------------------------------

  // Fetch relation by id
  async fetchRelation ({ id_user }) {
    return await db.query(
      `SELECT id_user_relation
             FROM user_relation
             WHERE id_user = ?`,
      [id_user]
    );
  }

  // Fetch interview progress by relation
  async fetchInterviewProgress ({ id_user_relation }) {
    return await db.query(
      `SELECT *
             FROM initial_interview_progress
             WHERE id_user_relation = ?`,
      [id_user_relation]
    );
  }

  // --------------------------------------------------------------------------
  // ----------------------------- GET Functions ------------------------------

  // ----- Datos Personales substep -------------------------------------------

  // Calculate age in years from a decrypted dd/mm/yyyy birthdate (mirrors domain/entity/user.js)
  calculateAge (birthdate) {
    if (!birthdate) return null;

    const [day, month, year] = birthdate.split('/');
    const birth = new Date(year, month - 1, day);

    if (isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    const beforeBirthdayThisYear =
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());

    if (beforeBirthdayThisYear) age -= 1;

    return age;
  }

  // Fetch read-only patient data (users + user_info)
  // Names, contact data, birthdate and laterality are encrypted at rest, so they
  // must be decrypted (and full_name/age derived) in JS rather than in SQL
  async fetchReadOnlyFields ({ id_user }) {
    const [rows] = await db.query(
      `SELECT
              ui.reference_number,
              u.first_name,
              u.lastname_p,
              u.lastname_m,
              u.email,
              ui.phone,
              u.birthdate,
              ui.laterality,
              ui.is_child
            FROM users AS u
            INNER JOIN user_info AS ui ON ui.id_user = u.id_user
            WHERE u.id_user = ?`,
      [id_user]
    );

    const row = rows[0];
    if (!row) return null;

    const birthdate = safeDecrypt(row.birthdate);

    return {
      reference_number: safeDecrypt(row.reference_number),
      full_name: [row.first_name, row.lastname_p, row.lastname_m]
        .map(safeDecrypt)
        .filter(Boolean)
        .join(' '),
      email: safeDecrypt(row.email),
      phone: safeDecrypt(row.phone),
      birthdate,
      age: this.calculateAge(birthdate),
      laterality: safeDecrypt(row.laterality),
      is_child: row.is_child,
    };
  }

  // Fetch Datos Personales by relation
  async fetchSubStep1Data ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT
              interview_date,
              interviewer_name,
              support_student_name,
              companions_name,
              companion_relation,
              address,
              proof_address,
              healthcare_system,
              religion,
              weight,
              size,
              imc,
              imc_category,
              schooling,
              residence,
              fathers_schooling,
              mothers_schooling,
              ocupation,
              score_age,
              score_schooling,
              score_interview_date
            FROM initial_interview
            WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return rows[0] || null;
  }

  // Fetch the children rows for a relation, ordered for stable rendering
  async fetchChildren ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT
              id_child,
              child_name,
              child_age,
              child_schooling,
              child_occupation
            FROM initial_interview_children
            WHERE id_user_relation = ?
            ORDER BY id_child ASC`,
      [id_user_relation]
    );

    return rows;
  }

  // Fetch Situación Familiar by relation (initial_interview fields + children[])
  async fetchSubStep2Data ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT
              in_relationship,
              relationship_duration,
              partners_name,
              partners_age,
              partners_ocupation,
              partners_health,
              has_children,
              number_family_members,
              roomie_info,
              aditional_info
            FROM initial_interview
            WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    const children = await this.fetchChildren({ id_user_relation });

    return {
      ...(rows[0] || {}),
      children,
    };
  }

  // Fetch Situación Laboral by relation
  async fetchSubStep3Data ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT
              has_job,
              work_activity,
              stress_work,
              employment_status,
              seniority,
              work_problems
            FROM initial_interview
            WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return rows[0] || null;
  }

  // Fetch Conclusiones by relation
  async fetchSubStep4Data ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT
              conclusions
            FROM initial_interview
            WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return rows[0] || null;
  }

  // --------------------------------------------------------------------------
  // ----------------------------- PATCH Functions ----------------------------

  // Save Datos Personales
  async saveSubStep1 ({ connection, id_user_relation, data }) {
    // No row exists in `initial_interview` until the first identification save:
    // upsert so the row is created on first save and merged on later ones.
    // `interview_date` is NOT NULL, so a missing value falls back to today's date
    // on insert, and keeps the stored value (instead of being nulled out) on update.
    await connection.query(
      `INSERT INTO initial_interview (
          id_user_relation, interview_date, interviewer_name, support_student_name,
          companions_name, companion_relation, address, proof_address, healthcare_system,
          religion, weight, size, imc, imc_category, schooling, residence,
          fathers_schooling, mothers_schooling, ocupation,
          score_age, score_schooling, score_interview_date
      ) VALUES (?, COALESCE(?, CURRENT_DATE), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          interview_date = COALESCE(?, interview_date),
          interviewer_name = VALUES(interviewer_name),
          support_student_name = VALUES(support_student_name),
          companions_name = VALUES(companions_name),
          companion_relation = VALUES(companion_relation),
          address = VALUES(address),
          proof_address = VALUES(proof_address),
          healthcare_system = VALUES(healthcare_system),
          religion = VALUES(religion),
          weight = VALUES(weight),
          size = VALUES(size),
          imc = VALUES(imc),
          imc_category = VALUES(imc_category),
          schooling = VALUES(schooling),
          residence = VALUES(residence),
          fathers_schooling = VALUES(fathers_schooling),
          mothers_schooling = VALUES(mothers_schooling),
          ocupation = VALUES(ocupation),
          score_age = VALUES(score_age),
          score_schooling = VALUES(score_schooling),
          score_interview_date = VALUES(score_interview_date)`,
      [
        id_user_relation,
        data.interviewDate,
        data.interviewerName,
        data.supportStudentName,
        data.companionsName,
        data.companionRelation,
        data.address,
        data.proofAddress,
        data.healthcareSystem,
        data.religion,
        data.weight,
        data.size,
        data.imc,
        data.imcCategory,
        data.schooling,
        data.residence,
        data.fathersSchooling,
        data.mothersSchooling,
        data.ocupation,
        data.scoreAge,
        data.scoreSchooling,
        data.scoreInterviewDate,

        data.interviewDate,
      ]
    );

    // Recompute inclusion_total as the sum of all 8 inclusion-criteria scores
    // currently stored on the row, after score_age/score_schooling/score_interview_date are saved
    await connection.query(
      `UPDATE initial_interview
          SET inclusion_total = COALESCE(score_age, 0) + COALESCE(score_schooling, 0)
                               + COALESCE(score_vision, 0) + COALESCE(score_hearing, 0)
                               + COALESCE(score_moca, 0) + COALESCE(score_psychiatric, 0)
                               + COALESCE(score_drug_use, 0) + COALESCE(score_interview_date, 0)
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );
  }

  // Save Situación Familiar info (pareja + familia) — same UPSERT pattern as
  // saveSubStep1, in case the relation reaches this substep before subStep1's first save
  async saveFamilySituationInfo ({ connection, id_user_relation, data }) {
    await connection.query(
      `INSERT INTO initial_interview (
          id_user_relation, interview_date, in_relationship, relationship_duration,
          partners_name, partners_age, partners_ocupation, partners_health,
          has_children, number_family_members, roomie_info, aditional_info
      ) VALUES (?, CURRENT_DATE, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          in_relationship = VALUES(in_relationship),
          relationship_duration = VALUES(relationship_duration),
          partners_name = VALUES(partners_name),
          partners_age = VALUES(partners_age),
          partners_ocupation = VALUES(partners_ocupation),
          partners_health = VALUES(partners_health),
          has_children = VALUES(has_children),
          number_family_members = VALUES(number_family_members),
          roomie_info = VALUES(roomie_info),
          aditional_info = VALUES(aditional_info)`,
      [
        id_user_relation,
        data.inRelationship,
        data.relationshipDuration,
        data.partnersName,
        data.partnersAge,
        data.partnersOcupation,
        data.partnersHealth,
        data.hasChildren,
        data.numberFamilyMembers,
        data.roomieInfo,
        data.aditionalInfo,
      ]
    );
  }

  // Save children rows (delete + insert, same pattern as contributing_people in financiera)
  async saveChildren ({ connection, id_user_relation, children }) {
    // Delete old children
    await connection.query(
      `DELETE FROM initial_interview_children
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    // Insert new children (rows without a name were already discarded by validateSubStep2)
    for (const child of children) {

      // eslint-disable-next-line no-await-in-loop
      await connection.query(
        `INSERT INTO initial_interview_children
          (
            id_user_relation,
            child_name,
            child_age,
            child_schooling,
            child_occupation
          )
          VALUES (?, ?, ?, ?, ?)`,
        [
          id_user_relation,
          child.childName,
          child.childAge,
          child.childSchooling,
          child.childOccupation,
        ]
      );
    }
  }

  // Save Situación Familiar substep info for a user relation
  async saveSubStep2 ({ connection, id_user_relation, data }) {

    await this.saveFamilySituationInfo({
      connection,
      id_user_relation,
      data,
    });

    await this.saveChildren({
      connection,
      id_user_relation,
      children: data.children,
    });
  }

  // Save Situación Laboral — same UPSERT pattern as
  // saveFamilySituationInfo, in case the relation reaches this substep before subStep1's first save
  async saveSubStep3 ({ connection, id_user_relation, data }) {
    await connection.query(
      `INSERT INTO initial_interview (
          id_user_relation, interview_date, has_job, work_activity, stress_work,
          employment_status, seniority, work_problems
      ) VALUES (?, CURRENT_DATE, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
          has_job = VALUES(has_job),
          work_activity = VALUES(work_activity),
          stress_work = VALUES(stress_work),
          employment_status = VALUES(employment_status),
          seniority = VALUES(seniority),
          work_problems = VALUES(work_problems)`,
      [
        id_user_relation,
        data.hasJob,
        data.workActivity,
        data.stressWork,
        data.employmentStatus,
        data.seniority,
        data.workProblems,
      ]
    );
  }

  // Save Conclusiones — same UPSERT pattern as saveFamilySituationInfo, in
  // case the relation reaches this substep before subStep1's first save
  async saveSubStep4 ({ connection, id_user_relation, data }) {
    await connection.query(
      `INSERT INTO initial_interview (
          id_user_relation, interview_date, conclusions
      ) VALUES (?, CURRENT_DATE, ?)
      ON DUPLICATE KEY UPDATE
          conclusions = VALUES(conclusions)`,
      [
        id_user_relation,
        data.conclusions,
      ]
    );
  }

  // ----- Update Identification Progress -------------------------------------

  async updateIdentificationCompleted ({ connection, id_user_relation, completed }) {
    await connection.query(
      `UPDATE initial_interview_progress
      SET identification_completed = ?
      WHERE id_user_relation = ?`,
      [
        completed,
        id_user_relation,
      ]
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

  // ---- MAIN PATCH Function -------------------------------------------------
  async saveIdentificationSection ({ subStep, id_user_relation, data, completed }) {
    // Connection for secure async queries
    const connection = await db.getConnection();

    try {

      await connection.beginTransaction();

      switch (subStep) {

        case 1:

          await this.saveSubStep1({
            connection,
            id_user_relation,
            data,
          });

          await this.updateIdentificationCompleted({
            connection,
            id_user_relation,
            completed,
          });

          break;

        case 2:

          await this.saveSubStep2({
            connection,
            id_user_relation,
            data,
          });

          await this.updateIdentificationCompleted({
            connection,
            id_user_relation,
            completed,
          });

          break;

        case 3:

          await this.saveSubStep3({
            connection,
            id_user_relation,
            data,
          });

          await this.updateIdentificationCompleted({
            connection,
            id_user_relation,
            completed,
          });

          break;

        case 4:

          await this.saveSubStep4({
            connection,
            id_user_relation,
            data,
          });

          await this.updateIdentificationCompleted({
            connection,
            id_user_relation,
            completed,
          });

          break;
      }

      await connection.commit();

      return {
        saved: true,
      };

    } catch (err) {
      console.error('[identification repo] saveIdentificationSection error:', err.message);

      await connection.rollback();

      throw err;

    } finally {

      connection.release();
    }
  }
}

module.exports = IdentificationInterviewRepository;