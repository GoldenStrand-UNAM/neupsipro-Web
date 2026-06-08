/* eslint-disable max-lines-per-function */
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
              ocupation
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
    await connection.query(
      `UPDATE initial_interview
      SET interview_date = ?,
          interviewer_name = ?,
          support_student_name = ?,
          companions_name = ?,
          companion_relation = ?,
          address = ?,
          proof_address = ?,
          healthcare_system = ?,
          religion = ?,
          weight = ?,
          size = ?,
          imc = ?,
          imc_category = ?,
          schooling = ?,
          residence = ?,
          fathers_schooling = ?,
          mothers_schooling = ?,
          ocupation = ?
      WHERE id_user_relation = ?`,
      [
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

        id_user_relation,
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
      }

      await connection.commit();

      return {
        saved: true,
      };

    } catch (err) {

      await connection.rollback();

      throw err;

    } finally {

      connection.release();
    }
  }
}

module.exports = IdentificationInterviewRepository;
