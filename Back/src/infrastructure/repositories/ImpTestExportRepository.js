const db = require('../database/database');
const TestExportRepository = require('../../domain/repository/testExportRepository');

class ImpTestExportRepository extends TestExportRepository {
  async fetchBanfeResults() {
    const [rows] = await db.query(`
      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'BANFE' AS test_type,
        tr.date_applied,

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
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')
      ORDER BY ui.reference_number ASC, tr.date_applied DESC
    `);

    return rows;
  }

  async fetchWaisResults() {
    const [rows] = await db.query(`
      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'WAIS' AS test_type,
        tr.date_applied,

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
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')
      ORDER BY ui.reference_number ASC, tr.date_applied DESC
    `);

    return rows;
  }

  async fetchReyResults() {
    const [rows] = await db.query(`
      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'REY' AS test_type,
        tr.date_applied,

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
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')
      ORDER BY ui.reference_number ASC, tr.date_applied DESC
    `);

    return rows;
  }

  async fetchMocaResults() {
    const [rows] = await db.query(`
      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'MOCA' AS test_type,
        tr.date_applied,

        mr.score,
        mr.interpretation,
        mr.notes
      FROM moca_results mr
      INNER JOIN test_results tr
        ON tr.id_results = mr.id_results
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')
      ORDER BY ui.reference_number ASC, tr.date_applied DESC
    `);

    return rows;
  }

  async fetchNihResults() {
    const [rows] = await db.query(`
      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'NIH' AS test_type,
        tr.date_applied,

        nr.notes
      FROM nih_results nr
      INNER JOIN test_results tr
        ON tr.id_results = nr.id_results
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')
      ORDER BY ui.reference_number ASC, tr.date_applied DESC
    `);

    return rows;
  }

  async fetchAllResults() {
    const [rows] = await db.query(`
      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'BANFE' AS test_type,
        tr.date_applied,

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

        NULL AS score,
        NULL AS interpretation,

        br.score_total,
        br.inter_total,
        br.notes
      FROM banfe_results br
      INNER JOIN test_results tr
        ON tr.id_results = br.id_results
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')

      UNION ALL

      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'WAIS' AS test_type,
        tr.date_applied,

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

        NULL AS score,
        NULL AS interpretation,

        wr.score_total,
        wr.inter_total,
        wr.notes
      FROM wais_results wr
      INNER JOIN test_results tr
        ON tr.id_results = wr.id_results
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')

      UNION ALL

      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'REY' AS test_type,
        tr.date_applied,

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

        NULL AS score,
        NULL AS interpretation,

        NULL AS score_total,
        NULL AS inter_total,
        rr.notes
      FROM rey_results rr
      INNER JOIN test_results tr
        ON tr.id_results = rr.id_results
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')

      UNION ALL

      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'MOCA' AS test_type,
        tr.date_applied,

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

        mr.score,
        mr.interpretation,

        NULL AS score_total,
        NULL AS inter_total,
        mr.notes
      FROM moca_results mr
      INNER JOIN test_results tr
        ON tr.id_results = mr.id_results
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')

      UNION ALL

      SELECT
        ui.reference_number AS folio,
        ui.protocol,
        'NIH' AS test_type,
        tr.date_applied,

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

        NULL AS score,
        NULL AS interpretation,

        NULL AS score_total,
        NULL AS inter_total,
        nr.notes
      FROM nih_results nr
      INNER JOIN test_results tr
        ON tr.id_results = nr.id_results
      INNER JOIN user_info ui
        ON ui.id_user = tr.id_user
      WHERE ui.protocol IN ('Clinical', 'Research')

      ORDER BY folio ASC, date_applied DESC
    `);

    return rows;
  }
}

module.exports = ImpTestExportRepository;