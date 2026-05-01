const db = require ("../database/database");
const ImpFinancialInterviewRepository = require('../../domain/repository/ImpFinancialInterviewRepository');
const FinancialInterview = require("../../domain/entity/FinancialInterview");

class FinancialInterviewRepository extends ImpFinancialInterviewRepository {

    // Fetch relation by id
    async fetchRelation ({ id_user }) {
        return await db.query(
            `SELECT id_user_relation
             FROM user_relation
             WHERE id_user = ?`,
            [id_user]
        );
    }

    // Fetch current section by relation
    async fetchCurrentSection ({ id_user_relation }) {
        return await db.query(
            `SELECT current_section
             FROM financial_progress
             WHERE id_user_relation = ?`,
            [id_user_relation]
        );
    }

    // Fetch financial situation by relation
    async fetchFinancialSituationInfo ({ id_user_relation }) {
        const rows = await db.query(
            `SELECT *
            FROM financial_situation
            WHERE id_user_relation = ?`,
            [id_user_relation]
        );

        return rows[0] || null;
    }

    // Fetch contributors by relation
    async fetchContributors ({ id_user_relation }) {
        const rows = await db.query(
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

        return new FinancialInterview({
            data: {
                base,
                contributors: contributorsRows,
            },
            current_section: 1,
        });
    }

    // Fetch ESC Goverment by relation
    async fetchEscGov ({ id_user_relation }) {
        const rows =  await db.query(
            `SELECT *
             FROM esc_government
             WHERE id_user_relation = ?`,
            [id_user_relation]
        );

        const base = rows[0] || {};

        return new FinancialInterview({
            data: base,
            current_section: 2,
        });
    }

    // Fetch AMAI Wuestionary by relation
    async fetchAmaiQ ({ id_user_relation }) {
        const rows =  await db.query(
            `SELECT *
             FROM amai_questionnaire
             WHERE id_user_relation = ?`,
            [id_user_relation]
        );

        return rows.map(row => new FinancialInterview({
            data: row,
            current_section: 3,
        }));
    }

    // Fetch results by relation
    async fetchResults ({ id_user_relation }) {
        const rows = await db.query(
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

        return rows.map(row => new FinancialInterview({
            data: row,
            current_section: 4,
        }));
    }
}

module.exports = FinancialInterviewRepository;