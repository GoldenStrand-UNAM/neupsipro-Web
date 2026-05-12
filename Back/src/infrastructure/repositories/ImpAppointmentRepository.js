const db = require('../database/database');
const appointmentRepository = require('../../domain/repository/appointmentRepository');

class ImpAppointmentRepository extends appointmentRepository {
  async fecthAppointmentWithClinical ({ idClinicalUser }) {
    const [users] = await db.query (
      `SELECT a.id_appointment, a.date_time, CONCAT_WS( ' ', u.first_name, u.lastname_p, u.lastname_m) AS full_name,
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
