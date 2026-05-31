const db = require('../database/database');
const clinicalRepository = require('../../domain/repository/clinicalRepository');
const userClinicalSummary = require('../../domain/entity/userClinicalSummary');
const Clinical = require('../../domain/entity/clinical');
const ClinicalPatient = require('../../domain/entity/clinicalPatient');
const Uncrypt = require('../crypt/clinical/getClinicals');
// 1. Importas la clase
const uncrypt = new Uncrypt();
const { v4: uuidv4 } = require('uuid');

class ImpClinicalRepository extends clinicalRepository {
  async fetchActivePatients ({ page, limit }) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Get active Users, rol = 2, with pagination
    const [rows] = await db.query (
      `SELECT 
            u.id_user AS id,
            u.first_name,
            u.lastname_p,
            u.lastname_m,
            uc.affiliation,
            uc.activity,
            (
              SELECT COUNT(*)
              FROM user_relation ur
              JOIN users pu ON pu.id_user = ur.id_user
              JOIN user_info ui ON ui.id_user = ur.id_user
              WHERE ur.id_clinic_user = u.id_user
                AND ur.type = 'assigned'
                AND pu.eliminated = '0'
                AND pu.id_role = 2
            ) AS assigned_count
        FROM users u
        LEFT JOIN user_clinical uc ON uc.id_user = u.id_user
        WHERE u.id_role = 3
          AND u.eliminated = 0
        LIMIT ? OFFSET ?`,
      [Number(limit), Number(offset)]
    );
    if (!rows || rows.legth === 0) return rows.map(row => new userClinicalSummary(row));
    const uncrypted = rows.map(row => uncrypt.uncryptUser(row));
    return uncrypted.map(row => new userClinicalSummary(row));
  }

  async countActivePatients () {
    const [rows] = await db.query (`SELECT COUNT(*) AS total
            FROM users
            WHERE id_role = 3
              AND eliminated = 0`);
    return rows[0]?.total ?? 0;
  }
  //get all clinical users
  async fetchAll () {
    const [rows] = await db.query(`SELECT 
      u.id_user AS id,
      u.first_name,
      u.lastname_p,
      u.lastname_m,
     FROM users u
     WHERE u.id_role = 3 AND u.eliminated = 0
     ORDER BY u.first_name ASC`);
    if (!rows || rows.legth === 0) return rows;
    const uncrypted = rows.map(row => uncrypt.uncryptAll(row));
    return uncrypted;
  }

  async fetchClinical ({ id_user }) {
    const [clinicalData] = await db.query (`SELECT 
      u.id_user,
      u.first_name, 
      u.lastname_p, 
      u.lastname_m,
      u.email,
      u.birthdate,
      uc.affiliation,
      uc.activity,
      uc.emergency_contact_name,
      uc.emergency_contact_phone,
      uc.emergency_contact_relation,
      uc.start_date,
      uc.finish_date,
      uc.hours
  FROM users u
  LEFT JOIN user_clinical uc ON u.id_user = uc.id_user
  WHERE u.id_user = ?;`, [id_user]);
    if (!clinicalData || clinicalData.length === 0)
      return clinicalData.map(row => new Clinical(row));
    return clinicalData.map(row => new Clinical(uncrypt.uncryptClinical(row)));
  }

  async fetchPatientsAssigned ({ id_user, page, limit }) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    const [patientsData] = await db.query (`
    SELECT 
      p.id_user,
      p.first_name, 
      p.lastname_p, 
      p.lastname_m,
      ui.state,
      ui.reference_number,
      ur.assignment_date,
      ur.type
    FROM user_relation ur
    INNER JOIN users p ON ur.id_user = p.id_user
    LEFT JOIN user_info ui ON p.id_user = ui.id_user
    WHERE ur.id_clinic_user = ? 
      AND p.eliminated = 0 
    LIMIT ? OFFSET ?;`, [id_user, Number(limit), Number(offset)]);
    const [[{ total }]] = await db.query(`
    SELECT COUNT(*) as total
      FROM user_relation ur
      INNER JOIN users p ON ur.id_user = p.id_user
      WHERE ur.id_clinic_user = ?
        AND p.eliminated = 0;
  `, [id_user]);

    const totalPages = Math.ceil(total / limit);

    if (!patientsData && patientsData.length === 0)
      return {
        patients: patientsData.map(row => new ClinicalPatient(row)),
        totalPages,
        page,
      };
    const uncrypted = patientsData.map(row => uncrypt.uncryptPatients(row));
    return {
      patients: uncrypted.map(row => new ClinicalPatient(row)),
      totalPages,
      page,
    };
  }

  async fetchClinicalUsers () {
    const [rows] = await db.query (`SELECT 
        id_user AS id,
        first_name,
        lastname_p,
        lastname_m
        FROM users
        WHERE id_role = 3
          AND eliminated = 0`);
    if (!rows || rows.legth === 0) rows.map(row => new userClinicalSummary(row));
    const uncrypted = rows.map(row => uncrypt.uncryptAll(row));
    return uncrypted.map(row => new userClinicalSummary(row));
  }

  async postUser (user) {
    const idUser = uuidv4();
    const connection = await db.getConnection();

    try {
      await connection.query('START TRANSACTION');

      await connection.query(
        `INSERT INTO users (id_user, id_role, user_name, first_name, lastname_p, lastname_m, birthdate,
        password_hash, email, dup_bindex)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idUser, '3', user.username, user.firstName, user.lastnameP, user.lastnameM, user.birthdate,
          user.passwordHash, user.email, user.bindex]
      );

      await connection.query(
        `INSERT INTO user_clinical (
        id_user, affiliation, activity, emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
        start_date, finish_date, hours)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idUser, user.affiliation, user.activity, user.emergencyContactName, user.emergencyContactPhone,
          user.emergencyContactRelation, user.startDate, user.finishDate, user.hours]
      );

      const [rows] = await connection.query(
        `SELECT 
        u.id_role, u.first_name, u.lastname_p, u.lastname_m, u.birthdate, u.email, u.user_name, u.password_hash,
        uc.affiliation, uc.activity, uc.emergency_contact_name, uc.emergency_contact_phone, uc.emergency_contact_relation,
        uc.start_date, uc.finish_date, uc.hours
        FROM users u
        LEFT JOIN user_clinical uc ON u.id_user = uc.id_user
        WHERE u.id_user = ?;`,
        [idUser]
      );

      await connection.query('COMMIT');

      return rows[0];
    } catch (error) {
      await connection.query('ROLLBACK');
      throw error;
    } finally {
      connection.release();
    }
  }

  async checkDuplicate (bindex) {
    const [rows] = await db.query (
      `SELECT *
          FROM users
          WHERE id_role = '3'
          AND dup_bindex = ?
          AND eliminated = '0';`,
      [bindex]
    );
    return rows[0];
  }
}
module.exports = ImpClinicalRepository;
