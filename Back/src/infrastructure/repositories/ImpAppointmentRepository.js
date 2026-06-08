const { v4: uuidv4 } = require('uuid');
const db = require('../database/database');
const appointmentRepository = require('../../domain/repository/appointmentRepository');
const Appointment = require('../../domain/entity/appointment');

class ImpAppointmentRepository extends appointmentRepository {

  // Finds the next upcoming appointment info of  a user or null
  async findUpcomingByUser ({ id_user }) {
    const [rows] = await db.query(
      `SELECT 
          a.id_appointment,
          a.id_user_relation,
          a.issue,
          a.date_time,
          CONCAT_WS(' ', uc.first_name, uc.lastname_p, uc.lastname_m) AS clinic_name
      FROM appointment a
      JOIN user_relation ur ON a.id_user_relation = ur.id_user_relation
      LEFT JOIN users uc ON ur.id_clinic_user = uc.id_user
      WHERE ur.id_user = ?
        AND ur.type = 'appointment'
        AND a.date_time >= NOW() - INTERVAL 6 HOUR
      ORDER BY a.date_time ASC
      LIMIT 1`,
      [id_user]
    );
    return rows.length ? new Appointment(rows[0]) : null;
  }

  // Creates an appointment and returns its id
  async findOrCreateUserRelation ({ id_user, id_clinic_user }) {
    const [existing] = await db.query(
      `SELECT id_user_relation 
       FROM user_relation 
       WHERE id_user = ? AND id_clinic_user = ? AND type = 'appointment'
       LIMIT 1`,
      [id_user, id_clinic_user]
    );

    if (existing.length) {
      return existing[0].id_user_relation;
    }
    // If no existing relation, create oneof the type 'appointment' and return its id
    const idUserRelation = uuidv4();
    await db.query(
      `INSERT INTO user_relation 
         (id_user_relation, id_user, id_clinic_user, assignment_date, type)
       VALUES (?, ?, ?, CURDATE(), 'appointment')`,
      [idUserRelation, id_user, id_clinic_user]
    );
    return idUserRelation;
  }
  // Creates an appointment and returns id
  async createAppointment ({ id_user_relation, issue, date_time }) {
    const idAppointment = uuidv4();
    await db.query(
      `INSERT INTO appointment (id_appointment, id_user_relation, issue, date_time)
       VALUES (?, ?, ?, ?)`,
      [idAppointment, id_user_relation, issue, date_time]
    );
    return idAppointment;
  }
  // Deletes the upcoming appointment of a user, returns true if deleted
async deleteUpcomingByUser ({ id_user }) {
  const [rows] = await db.query(
    `SELECT a.id_appointment
     FROM appointment a
     JOIN user_relation ur ON a.id_user_relation = ur.id_user_relation
     WHERE ur.id_user = ?
       AND ur.type = 'appointment'
       AND a.date_time >= NOW() - INTERVAL 6 HOUR
     ORDER BY a.date_time ASC
     LIMIT 1`,
    [id_user]
  );

  if (rows.length === 0) {
    return false;
  }

  await db.query(
    'DELETE FROM appointment WHERE id_appointment = ?',
    [rows[0].id_appointment]
  );

  return true;
}
  async fecthAppointmentWithClinical ({ idClinicalUser }) {
    const [users] = await db.query (`SELECT a.id_appointment, a.date_time, a.issue, CONCAT_WS( ' ', u.first_name, u.lastname_p, u.lastname_m) AS full_name,
      CASE
          WHEN DATE(a.date_time) = CURDATE() THEN 'today'
        WHEN DATE(a.date_time) = DATE_ADD(CURDATE(), INTERVAL 1 DAY) THEN 'tomorrow'
            ELSE 'others'
      END AS day_separation
        FROM appointment a
            JOIN user_relation ur ON ur.id_user_relation = a.id_user_relation
            JOIN users u ON u.id_user = ur.id_user
          WHERE ur.id_clinic_user = ? AND DATE(a.date_time) >= CURDATE()`, [idClinicalUser]);
    return users;
  }
}

module.exports = ImpAppointmentRepository;
