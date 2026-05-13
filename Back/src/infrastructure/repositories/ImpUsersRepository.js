const db = require('../database/database');
const usersRepository = require('../../domain/repository/usersRepository');
const userSummary = require('../../domain/entity/userSummaryEntity');
const { v4: uuidv4 } = require('uuid');

class ImpUsersRepository extends usersRepository {
  async fetchActivePatients ({ search, page, limit }) {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Prepare search parameter for SQL
    const searchParam = search ? `%${search}%` : null;

    // Get active Users, rol = 2, with pagination and a optional search filter
    const [rows] = await db.query(
      `SELECT 
                u.id_user AS id,
                CONCAT(u.first_name, ' ', u.lastname_p, ' ', COALESCE(u.lastname_m, '')) AS full_name,
                l.reference_number,
                l.neuro_status,
                l.protocol
            FROM users u
            LEFT JOIN user_info l ON l.id_user = u.id_user
            WHERE u.id_role = 2
              AND u.eliminated = 0
              AND (? IS NULL OR CONCAT(u.first_name, ' ', u.lastname_p, ' ', COALESCE(u.lastname_m, '')) LIKE ?)
            ORDER BY u.first_name ASC
            LIMIT ? OFFSET ?`,
      [searchParam, searchParam, Number(limit), Number(offset)]
    );
    return rows.map(row => new userSummary(row));
  }

  async countActivePatients ({ search }) {
    // Prepare search parameter for SQL
    const searchParam = search ? `%${search}%` : null;

    const [rows] = await db.query (
      `SELECT COUNT(*) AS total
            FROM users
            WHERE id_role = 2
              AND eliminated = 0
              AND (? IS NULL OR CONCAT(user_name, ' ', lastname_p, ' ', lastname_m) LIKE ?)`,
      [searchParam, searchParam]
    );
    return rows[0]?.total ?? 0;
  }

  async postUser ({idRole, userName, firstName, lastnameP, lastnameM, birthdate, passwordHash, assigned, phase, basePathology, modality, profilePhoto, referenceNumber, amputationDate, amputationLevel, laterality, prosthetist, neuroEntryDate, pairs, sex }) {
    const idUser = uuidv4();
        
    try{
      await db.query(
      `INSERT INTO users (id_user, id_role, user_name, first_name, lastname_p, lastname_m, birthdate, password_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [idUser, idRole, userName, firstName, lastnameP, lastnameM, birthdate, passwordHash]
      );

      await db.query(
      `INSERT INTO user_info (id_user, id_clinical, program_phase, base_pathology, modality, profile_photo, registration_date, reference_number, laterality, prosthetist, neuro_entry_date, amputation_date, amputation_level, group_intervention, sex)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [idUser, assigned, phase, basePathology, modality, profilePhoto, referenceNumber, laterality, prosthetist, neuroEntryDate, amputationDate, amputationLevel, pairs, sex] 
      );
    } catch (error){
      console.log("Error en base de datos: ", error.message);
      throw error;
    }
  }
}
module.exports = ImpUsersRepository;
