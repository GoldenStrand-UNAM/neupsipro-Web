/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
const db = require ('../database/database');
const ImpFinancialInterviewRepository = require('../../domain/repository/ImpFinancialInterviewRepository');

class FinancialInterviewRepository extends ImpFinancialInterviewRepository {

  // ----- Auxiliar functions -------------------------------------------------
  // Fetch user id by reference number
  async fetchUserId ({ refNumber }) {
    return await db.query(
      `SELECT id_user
             FROM user_info
             WHERE reference_number = ?`,
      [refNumber]
    );
  }

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

  // Fetch financial progress by relation
  async fetchFinancialProgress ({ id_user_relation }) {
    return await db.query(
      `SELECT *
             FROM financial_progress
             WHERE id_user_relation = ?`,
      [id_user_relation]
    );
  }

  // --------------------------------------------------------------------------
  // ----------------------------- GET Functions ------------------------------

  // ----- Financial substep --------------------------------------------------
  // Fetch financial situation by relation
  async fetchFinancialSituationInfo ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT *
            FROM financial_situation
            WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return rows[0] || null;
  }

  // Fetch contributors by relation
  async fetchContributors ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT contributor, relation, income
            FROM contributing_people
            WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return rows;
  }

  // Get elements to create the entity
  async fetchFinancialSituation ({ id_user_relation }) {
    const base = await this.fetchFinancialSituationInfo({ id_user_relation });
    const contributorsRows = await this.fetchContributors({ id_user_relation });

    return {
      data: {
        base,
        contributors: contributorsRows,
      },
    };
  }

  // ----- ESC substep --------------------------------------------------------

  // Data for autocomplete inputs
  async fetchExtraEscGov ({ id_user_relation }) {

    const [rows] = await db.query(
      `SELECT total_income,
              total_expenses,
              num_economic_dependents
     FROM financial_situation
     WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return rows[0] || {};
  }

  // Fetch ESC Government by relation
  async fetchEscGov ({ id_user_relation }) {

    const [rows] = await db.query(
      `SELECT *
     FROM esc_government
     WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    const extra = await this.fetchExtraEscGov({
      id_user_relation,
    });

    return {
      ...(rows[0] || {}),
      extra,
    };
  }

  // ----- AMAI substep -------------------------------------------------------

  // Fetch AMAI Wuestionary by relation
  async fetchAmaiQ ({ id_user_relation }) {
    const [rows] =  await db.query(
      `SELECT *
             FROM amai_questionnaire
             WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    return rows;
  }

  // ----- Results substep -----------------------------------------------------
  // Fetch results by relation
  async fetchResults ({ id_user_relation }) {
    const [rows] = await db.query(
      `SELECT 
                fs.total_income, 
                fs.total_expenses,
                g.socioeconomic_level AS socio_level_gov, 
                g.total AS total_gov,
                a.socioeconomic_level AS socio_level_amai, 
                a.total AS total_amai
            FROM financial_situation AS fs
            INNER JOIN esc_government AS g 
                ON g.id_user_relation = fs.id_user_relation
            INNER JOIN amai_questionnaire AS a 
                ON a.id_user_relation = fs.id_user_relation
            WHERE fs.id_user_relation = ?`,
      [id_user_relation]
    );

    return rows;
  }

  // --------------------------------------------------------------------------
  // ----------------------------- PATCH Functions ----------------------------

  // -----  SAVE Financial Data -----------------------------------------------

  // Save financial situation info
  async saveFinancialSituationInfo ({ connection, id_user_relation, data }) {

    await connection.query(
      `UPDATE financial_situation
      SET has_financing_schoolarship = ?,
          financial_type = ?,
          salary_before_sickness = ?,
          salary_after_sickness = ?,
          food_expenses = ?,
          rent_expenses = ?,
          services_expenses = ?,
          gas_expenses = ?,
          education_expenses = ?,
          wardrobe_expenses = ?,
          medical_expenses = ?,
          transport_expenses = ?,
          creditcard_payment_expenses = ?,
          phone_expenses = ?,
          others_expenses = ?,
          economic_situation = ?,
          num_economic_dependents = ?,
          total_income = ?,
          total_expenses = ?
      WHERE id_user_relation = ?`,
      [
        data.incomes.incomeExtra,
        data.incomes.financialType,
        data.incomes.salaryBefore,
        data.incomes.salaryAfter,

        data.expenses.foodExpenses,
        data.expenses.rentExpenses,
        data.expenses.servicesExpenses,
        data.expenses.gasExpenses,
        data.expenses.educationExpenses,
        data.expenses.wardrobeExpenses,
        data.expenses.medicalExpenses,
        data.expenses.transportExpenses,
        data.expenses.creditcardExpenses,
        data.expenses.phoneExpenses,
        data.expenses.othersExpenses,
        data.expenses.economicSituation,
        data.expenses.numEconomicDependents,

        data.incomes.totalIncomes,
        data.expenses.totalExpenses,

        id_user_relation,
      ]
    );
  }

  // Save contributors
  async saveContributors ({ connection, id_user_relation, contributors }) {
    // Delete old contributors
    await connection.query(
      `DELETE FROM contributing_people
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    // Insert new contributors
    for (const contributor of contributors) {

      // eslint-disable-next-line no-await-in-loop
      await connection.query(
        `INSERT INTO contributing_people
          (
            id_user_relation,
            contributor,
            relation,
            income
          )
          VALUES (?, ?, ?, ?)`,
        [
          id_user_relation,
          contributor.name,
          contributor.relation,
          contributor.income,
        ]
      );
    }
  }

  // Save financial substep info for a user relation
  async saveFinancialSituation ({ connection, id_user_relation, data }) {

    await this.saveFinancialSituationInfo({
      connection,
      id_user_relation,
      data,
    });

    await this.saveContributors({
      connection,
      id_user_relation,
      contributors: data.contributors,
    });
  }

  // Save ESC Government substep
  async saveEscGov ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE esc_government
      SET min_income = ?,
          ocupation = ?,
          family_expenses = ?,
          real_right = ?,
          housing_type = ?,
          public_services = ?,
          inhome_services = ?,
          construction_material = ?,
          num_bedrooms = ?,
          persons_per_bedroom = ?,
          treatment_time = ?,
          other_problems = ?,
          family_health = ?,
          total = ?,
          socioeconomic_level = ?
      WHERE id_user_relation = ?`,
      [
        data.minIncome,
        data.ocupation,
        data.familyExpenses,

        data.housing.realRight,
        data.housing.housingType,
        data.housing.publicServices,
        data.housing.inhomeServices,
        data.housing.constructionMaterial,
        data.housing.numBedrooms,
        data.housing.personsPerBedroom,

        data.familyConditions.treatmentTime,
        data.familyConditions.otherProblems,
        data.familyConditions.familyHealth,

        data.total,
        data.socioeconomicLevel,

        id_user_relation,
      ]
    );
  }

  // Save AMAI questtionarie substep
  async saveAmai ({ connection, id_user_relation, data }) {
    await connection.query(
      `UPDATE amai_questionnaire
      SET last_studies = ?,
          num_bathrooms = ?,
          num_car = ?,
          has_internet = ?,
          has_worked = ?,
          has_bedroom = ?,
          total = ?,
          socioeconomic_level = ?
      WHERE id_user_relation = ?`,
      [
        data.lastStudies,
        data.numBathrooms,
        data.numCar,
        data.hasInternet,
        data.hasWorked,
        data.hasBedroom,

        data.total,
        data.socioeconomicLevel,

        id_user_relation,
      ]
    );
  }

  // ----- Save Substeps Progress ---------------------------------------------

  // Update incomes and expenses progress
  async updateIANDEProgress ({ connection, id_user_relation, completed }) {

    await connection.query(
      `UPDATE financial_progress
      SET income_expenses_completed = ?
      WHERE id_user_relation = ?`,
      [
        completed,
        id_user_relation,
      ]
    );
  }

  // Update amai progress
  async updateESCProgress ({ connection, id_user_relation, completed }) {

    await connection.query(
      `UPDATE financial_progress
      SET esc_completed = ?
      WHERE id_user_relation = ?`,
      [
        completed,
        id_user_relation,
      ]
    );
  }

  // Update financial step 3 progress
  async updateAMAIProgress ({ connection, id_user_relation, completed }) {

    await connection.query(
      `UPDATE financial_progress
      SET amai_completed = ?
      WHERE id_user_relation = ?`,
      [
        completed,
        id_user_relation,
      ]
    );
  }

  // ----- Update Financial Progress ------------------------------------------
  async updateFinancialProgress ({ id_user_relation }) {

    await db.query(
      `UPDATE financial_progress
        SET status = 'completed'
        WHERE id_user_relation = ?`,
      [id_user_relation]
    );

    await db.query(
      `UPDATE initial_interview_progress
        SET financial_completed = 1
        WHERE id_user_relation = ?`,
      [id_user_relation]
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
  async saveFinancialSection ({ subStep, id_user_relation, data, completed }) {

    // Connection for secure async queries
    const connection = await db.getConnection();

    try {

      await connection.beginTransaction();

      switch (subStep) {

        case 1:

          await this.saveFinancialSituation({
            connection,
            id_user_relation,
            data,
          });

          await this.updateIANDEProgress({
            connection,
            id_user_relation,
            completed,
          });

          break;

        case 2:

          await this.saveEscGov({
            connection,
            id_user_relation,
            data,
          });

          await this.updateESCProgress({
            connection,
            id_user_relation,
            completed,
          });

          break;

        case 3:

          await this.saveAmai({
            connection,
            id_user_relation,
            data,
          });

          await this.updateAMAIProgress({
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

module.exports = FinancialInterviewRepository;
