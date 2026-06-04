const db = require('../database/database');
const TestExportRepository = require('../../domain/repository/testExportRepository');
const uncrypt = require('../crypt/exports/exports');

class ImpTestExportRepository extends TestExportRepository {
  async fetchBanfeResults() {
    const [rows] = await db.query(`
      SELECT
        'BANFE' AS test_type,
        tr.id_test,
        tr.date_applied,

        u.user_name,
        u.first_name,
        u.lastname_p,
        u.lastname_m,

        pt.result_table,

        br.id_banfe,
        br.score_orbit_frontal,
        br.inter_orbit_frontal,
        br.score_prefrontal_before,
        br.inter_prefrontal_before,
        br.score_d_lateral,
        br.inter_d_lateral,
        br.score_total,
        br.inter_total,
        br.notes
      FROM banfe_results br
      INNER JOIN test_results tr
        ON tr.id_results = br.id_results
      LEFT JOIN users u
        ON u.id_user = tr.id_user
      LEFT JOIN psych_tests pt
        ON pt.id_test = tr.id_test
      ORDER BY tr.date_applied DESC
    `);
    if(rows) return uncrypt(rows);
    return rows;
  }

  async fetchWaisResults() {
    const [rows] = await db.query(`
      SELECT
        'WAIS' AS test_type,
        tr.id_test,
        tr.date_applied,

        u.user_name,
        u.first_name,
        u.lastname_p,
        u.lastname_m,

        pt.result_table,

        wr.id_wais,
        wr.score_com_verbal,
        wr.inter_com_verbal,
        wr.score_razon_perceptual,
        wr.inter_razon_perceptual,
        wr.score_mem_work,
        wr.inter_mem_work,
        wr.score_velo_proce,
        wr.inter_velo_proce,
        wr.score_total,
        wr.inter_total,
        wr.notes
      FROM wais_results wr
      INNER JOIN test_results tr
        ON tr.id_results = wr.id_results
      LEFT JOIN users u
        ON u.id_user = tr.id_user
      LEFT JOIN psych_tests pt
        ON pt.id_test = tr.id_test
      ORDER BY tr.date_applied DESC
    `);
    if(rows) return uncrypt(rows);
    return rows;
  }

  async fetchReyResults() {
    const [rows] = await db.query(`
      SELECT
        'REY' AS test_type,
        tr.id_test,
        tr.date_applied,

        u.user_name,
        u.first_name,
        u.lastname_p,
        u.lastname_m,

        pt.result_table,

        rr.id_rey,
        rr.score_rc,
        rr.pc_rc,
        rr.time_rc,
        rr.pc_time_rc,
        rr.score_mcp,
        rr.pc_mcp,
        rr.time_mcp,
        rr.pc_time_mcp,
        rr.score_mlp,
        rr.pc_mlp,
        rr.time_mlp,
        rr.pc_time_mlp,
        rr.notes
      FROM rey_results rr
      INNER JOIN test_results tr
        ON tr.id_results = rr.id_results
      LEFT JOIN users u
        ON u.id_user = tr.id_user
      LEFT JOIN psych_tests pt
        ON pt.id_test = tr.id_test
      ORDER BY tr.date_applied DESC
    `);
    if(rows) return uncrypt(rows);
    return rows;
  }

  async fetchAllResults() {
    const [rows] = await db.query(`
      SELECT
        'BANFE' AS test_type,
        tr.id_test,
        tr.date_applied,

        u.user_name,
        u.first_name,
        u.lastname_p,
        u.lastname_m,

        pt.result_table,

        br.id_banfe,
        NULL AS id_wais,
        NULL AS id_rey,

        br.score_orbit_frontal,
        br.inter_orbit_frontal,
        br.score_prefrontal_before,
        br.inter_prefrontal_before,
        br.score_d_lateral,
        br.inter_d_lateral,

        NULL AS score_com_verbal,
        NULL AS inter_com_verbal,
        NULL AS score_razon_perceptual,
        NULL AS inter_razon_perceptual,
        NULL AS score_mem_work,
        NULL AS inter_mem_work,
        NULL AS score_velo_proce,
        NULL AS inter_velo_proce,

        NULL AS score_rc,
        NULL AS pc_rc,
        NULL AS time_rc,
        NULL AS pc_time_rc,
        NULL AS score_mcp,
        NULL AS pc_mcp,
        NULL AS time_mcp,
        NULL AS pc_time_mcp,
        NULL AS score_mlp,
        NULL AS pc_mlp,
        NULL AS time_mlp,
        NULL AS pc_time_mlp,

        br.score_total,
        br.inter_total,
        br.notes
      FROM banfe_results br
      INNER JOIN test_results tr
        ON tr.id_results = br.id_results
      LEFT JOIN users u
        ON u.id_user = tr.id_user
      LEFT JOIN psych_tests pt
        ON pt.id_test = tr.id_test

      UNION ALL

      SELECT
        'WAIS' AS test_type,
        tr.id_test,
        tr.date_applied,

        u.user_name,
        u.first_name,
        u.lastname_p,
        u.lastname_m,

        pt.result_table,

        NULL AS id_banfe,
        wr.id_wais,
        NULL AS id_rey,

        NULL AS score_orbit_frontal,
        NULL AS inter_orbit_frontal,
        NULL AS score_prefrontal_before,
        NULL AS inter_prefrontal_before,
        NULL AS score_d_lateral,
        NULL AS inter_d_lateral,

        wr.score_com_verbal,
        wr.inter_com_verbal,
        wr.score_razon_perceptual,
        wr.inter_razon_perceptual,
        wr.score_mem_work,
        wr.inter_mem_work,
        wr.score_velo_proce,
        wr.inter_velo_proce,

        NULL AS score_rc,
        NULL AS pc_rc,
        NULL AS time_rc,
        NULL AS pc_time_rc,
        NULL AS score_mcp,
        NULL AS pc_mcp,
        NULL AS time_mcp,
        NULL AS pc_time_mcp,
        NULL AS score_mlp,
        NULL AS pc_mlp,
        NULL AS time_mlp,
        NULL AS pc_time_mlp,

        wr.score_total,
        wr.inter_total,
        wr.notes
      FROM wais_results wr
      INNER JOIN test_results tr
        ON tr.id_results = wr.id_results
      LEFT JOIN users u
        ON u.id_user = tr.id_user
      LEFT JOIN psych_tests pt
        ON pt.id_test = tr.id_test

      UNION ALL

      SELECT
        'REY' AS test_type,
        tr.id_test,
        tr.date_applied,

        u.user_name,
        u.first_name,
        u.lastname_p,
        u.lastname_m,

        pt.result_table,

        NULL AS id_banfe,
        NULL AS id_wais,
        rr.id_rey,

        NULL AS score_orbit_frontal,
        NULL AS inter_orbit_frontal,
        NULL AS score_prefrontal_before,
        NULL AS inter_prefrontal_before,
        NULL AS score_d_lateral,
        NULL AS inter_d_lateral,

        NULL AS score_com_verbal,
        NULL AS inter_com_verbal,
        NULL AS score_razon_perceptual,
        NULL AS inter_razon_perceptual,
        NULL AS score_mem_work,
        NULL AS inter_mem_work,
        NULL AS score_velo_proce,
        NULL AS inter_velo_proce,

        rr.score_rc,
        rr.pc_rc,
        rr.time_rc,
        rr.pc_time_rc,
        rr.score_mcp,
        rr.pc_mcp,
        rr.time_mcp,
        rr.pc_time_mcp,
        rr.score_mlp,
        rr.pc_mlp,
        rr.time_mlp,
        rr.pc_time_mlp,

        NULL AS score_total,
        NULL AS inter_total,
        rr.notes
      FROM rey_results rr
      INNER JOIN test_results tr
        ON tr.id_results = rr.id_results
      LEFT JOIN users u
        ON u.id_user = tr.id_user
      LEFT JOIN psych_tests pt
        ON pt.id_test = tr.id_test

      ORDER BY date_applied DESC
    `);
    if(rows) return uncrypt(rows);
    return rows;
  }
}

module.exports = ImpTestExportRepository;