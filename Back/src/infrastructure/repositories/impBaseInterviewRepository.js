const db = require('../database/database');
const baseInterviewRepository = require('../../domain/repository/baseInterviewRepository');
const BaseInterview = require('../../domain/entity/baseInterview');

class ImpBaseInterview extends baseInterviewRepository {
  async getIdentificationCard ({ id_user }) {
    const [presavedData] = await db.query (`SELECT 
        u.first_name, 
        u.lastname_p, 
        u.lastname_m, 
        u.birthdate,
        ui.laterality 
        FROM users u 
        JOIN user_info ui ON u.id_user = ui.id_user 
        WHERE u.id_user = ?;`, [id_user]);
    return presavedData.map(row => new BaseInterview(row));
  }

  async postPersonalData ({ data }) {
    const { id_user, first_name, lastname_p, lastname_m, birthdate, email,
      laterality, student_name, interview_date, companions_name,
      companion_relation, address, proof_address, healthcare_system,
      religion, weight, size, schooling, fathers_schooling,
      mothers_schooling, ocupation, phone_number,
    } = data;

    await db.query (
      `UPDATE 
        users SET first_name=?, lastname_p=?, 
        lastname_m=?, birthdate=?, email=? WHERE id_user=?;
        UPDATE user_info SET laterality=? WHERE id_user=?;
        INSERT INTO initial_interview VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [first_name, lastname_p, lastname_m, birthdate, email, id_user,
        laterality, id_user, id_user, student_name, interview_date, companions_name, companion_relation,
        address, proof_address, healthcare_system, religion, weight, size, schooling, fathers_schooling,
        mothers_schooling, ocupation, phone_number]
    );
  }

  async postFamilySituation ({ data }) {
    const { in_relationship, relationship_duration, partners_name,
      partners_age, partners_ocupation, partners_health,
      has_children, childrens_names, number_family_members,
      roomie_info, aditional_info, id_user,
    } = data;
    await db.query (
      `UPDATE initial_interview SET 
        in_relationship=?, relationship_duration=?, 
        partners_name=?, partners_age=?, 
        partners_ocupation=?, partners_health=?, 
        has_children=?, childrens_names=?, 
        number_family_members=?, roomie_info=?, 
        aditional_info=? WHERE id_user=?;`,
      [in_relationship, relationship_duration, partners_name,
        partners_age, partners_ocupation, partners_health,
        has_children, childrens_names, number_family_members,
        roomie_info, aditional_info, id_user]
    );
  }

  async getWorkSituation ({ id_user }) {
    const [workSituation] = await db.query(`SELECT 
      has_job, work_activity, stress_work,
      work_problems, employment_status, seniority,
      employer, employers_phone_number FROM initial_interview WHERE id_user = ?;`, [id_user]);
    return workSituation.map(row => new BaseInterview(row));
  }

  async postWorkSituation ({ data }) {
    const { has_job, work_activity, stress_work,
      work_problems, employment_status, seniority,
      employer, employers_phone_number, id_user,
    } = data;
    await db.query (
      `UPDATE initial_interview SET 
        has_job=?, work_activity=?, stress_work=?, 
        work_problems=?, employment_status=?, seniority=?, 
        employer=?, employers_phone_number=? WHERE id_user=?;`,
      [has_job, work_activity, stress_work,
        work_problems, employment_status, seniority,
        employer, employers_phone_number, id_user]
    );
  }
}
module.exports = ImpBaseInterview;
