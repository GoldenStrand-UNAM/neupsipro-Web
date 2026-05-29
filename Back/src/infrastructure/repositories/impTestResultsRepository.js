const db = require ('../database/database');
const Tests = require('../../domain/entity/tests');
const resultRepository = require('../../domain/repository/resultRepository');
const { v4: uuidv4 } = require('uuid');

class impTestResultsRepository extends resultRepository {

  // Validate that a application exist before getting the tests
  async fetchApplicationById ({ id_application }) {
    const [rows] = await db.query(
      `SELECT id_application, id_user, application_name, status, created_at
       FROM test_applications
       WHERE id_application = ?`,
      [id_application]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      idApplication: row.id_application,
      idUser: row.id_user,
      applicationName: row.application_name,
      status: row.status,
      createdAt: row.created_at,
    };
  }

  //Fetch all test for a specific application
  async fetchTestsByApplication ({ id_user, id_application }) {
    const [rows] = await db.query(
      `SELECT tr.id_results,
              tr.id_application,
              tr.id_test,
              pt.test_name,
              pt.result_table,
              tr.status,
              tr.date_applied
              FROM test_results tr
       JOIN psych_tests pt ON tr.id_test = pt.id_test
       WHERE tr.id_user        = ?
         AND tr.id_application = ?`,
      [id_user, id_application]
    );
    return rows.map(row => new Tests(row));
  }

  // Insert one result row per test in the resolved protocol.
  async createResults (id_application, id_user, tests) {
    if (!tests || tests.length === 0) return [];

    const placeholders = tests.map(() => '(?, ?, ?, ?, 1)').join(', ');
    const values       = tests.flatMap(id_test => [uuidv4(), id_user, id_application, id_test]);

    const [result] = await db.query(
      `INSERT INTO test_results (id_results, id_user, id_application, id_test, status)
      VALUES ${placeholders}`,
      values
    );

    return result;
  }

  // Looks up the test_results row for a given user + application + test.
  async fetchResultRow ({ id_user, id_application, id_test }) {
    const [rows] = await db.query(
      `SELECT id_results, status
        FROM test_results
        WHERE id_user       = ?
          AND id_application = ?
          AND id_test        = ?
        LIMIT 1`,
      [id_user, id_application, id_test]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      idResults: row.id_results,
      status: row.status,
    };
  }

  //============ STATUS =================================

  // Fetch all test statuses for an application — used to check if all are graded.
  async fetchTestStatusByApplication ({ id_application }) {
    const [rows] = await db.query(
      `SELECT status
      FROM test_results
      WHERE id_application = ?`,
      [id_application]
    );
    return rows.map(r => r.status);
  }

  // Set status 5 (Caducada) on all incomplete tests within an application.
  // Tests already graded (status 3) are preserved.
  async expireIncompleteTests ({ id_application }) {
    await db.query(
      `UPDATE test_results
      SET status = 5
      WHERE id_application = ?
        AND status != 3`,
      [id_application]
    );
  }

  // Fetch status and date_applied for all tests in an application.
  // Used by checkExpiryUseCase to evaluate per-test expiry.
  async fetchTestsWithDateByApplication ({ id_application }) {
    const [rows] = await db.query(
      `SELECT status, date_applied
      FROM test_results
      WHERE id_application = ?`,
      [id_application]
    );
    return rows.map(r => ({
      status: r.status,
      date_applied: r.date_applied ?? null,
    }));
  }

  // ================= BANFE  ==================

  // Upserts into banfe_results
  // works for both first-time registration and modify.
  // Also updates status from test_results

  // Post BANFE
  async saveBanfeResult ({
    id_results,
    score_orbit_frontal,  inter_orbit_frontal,
    score_prefrontal_before, inter_prefrontal_before,
    score_d_lateral,      inter_d_lateral,
    score_total, notes,
  }) {
  // Update parent row status and application date
    await db.query(
      `UPDATE test_results
     SET status       = 3,
         date_applied = CURDATE()
     WHERE id_results = ?`,
      [id_results]
    );

    // ON DUPLICATE KEY covers the case where a row already exists (modify flow)
    await db.query(
      `INSERT INTO banfe_results
       (id_results,
        score_orbit_frontal,    inter_orbit_frontal,
        score_prefrontal_before, inter_prefrontal_before,
        score_d_lateral,        inter_d_lateral,
        score_total, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
        score_orbit_frontal     = VALUES(score_orbit_frontal),
        inter_orbit_frontal     = VALUES(inter_orbit_frontal),
        score_prefrontal_before = VALUES(score_prefrontal_before),
        inter_prefrontal_before = VALUES(inter_prefrontal_before),
        score_d_lateral         = VALUES(score_d_lateral),
        inter_d_lateral         = VALUES(inter_d_lateral),
        score_total             = VALUES(score_total),
        notes                   = VALUES(notes)`,
      [
        id_results,
        score_orbit_frontal,    inter_orbit_frontal,
        score_prefrontal_before, inter_prefrontal_before,
        score_d_lateral,        inter_d_lateral,
        score_total,            notes,
      ]
    );

    // Return the saved row together with the date just written to test_results
    const [rows] = await db.query(
      `SELECT br.*, tr.date_applied
       FROM banfe_results br
       JOIN test_results tr ON br.id_results = tr.id_results
       WHERE br.id_results = ?`,
      [id_results]
    );
    return rows[0];
  }

  // CONSULT BANFE
  async fetchBanfeResult ({ id_results }) {
    const [rows] = await db.query(
      `SELECT br.*,
              tr.status,
              tr.date_applied
      FROM banfe_results br
      JOIN test_results tr ON br.id_results = tr.id_results
      WHERE br.id_results = ?
      LIMIT 1`,
      [id_results]
    );
    return rows[0] ?? null;
  }

  // ================= Wais ==================

  // post Wais
  async saveWaisResult ({
    id_results,
    score_com_verbal,       inter_com_verbal,
    score_razon_perceptual, inter_razon_perceptual,
    score_mem_work,         inter_mem_work,
    score_velo_proce,       inter_velo_proce,
    score_total,            inter_total,
    notes,
  }) {

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `INSERT INTO wais_results
          (id_results,
            score_com_verbal,       inter_com_verbal,
            score_razon_perceptual, inter_razon_perceptual,
            score_mem_work,         inter_mem_work,
            score_velo_proce,       inter_velo_proce,
            score_total,            inter_total,
            notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            score_com_verbal       = VALUES(score_com_verbal),
            inter_com_verbal       = VALUES(inter_com_verbal),
            score_razon_perceptual = VALUES(score_razon_perceptual),
            inter_razon_perceptual = VALUES(inter_razon_perceptual),
            score_mem_work         = VALUES(score_mem_work),
            inter_mem_work         = VALUES(inter_mem_work),
            score_velo_proce       = VALUES(score_velo_proce),
            inter_velo_proce       = VALUES(inter_velo_proce),
            score_total            = VALUES(score_total),
            inter_total            = VALUES(inter_total),
            notes                  = VALUES(notes)`,
        [
          id_results,
          score_com_verbal,       inter_com_verbal,
          score_razon_perceptual, inter_razon_perceptual,
          score_mem_work,         inter_mem_work,
          score_velo_proce,       inter_velo_proce,
          score_total,            inter_total,
          notes,
        ]
      );

      await conn.query(
        `UPDATE test_results
        SET status       = 3,
            date_applied = CURDATE()
        WHERE id_results = ?`,
        [id_results]
      );

      await conn.commit();

      const [rows] = await conn.query(
        'SELECT * FROM wais_results WHERE id_results = ?',
        [id_results]
      );
      return rows[0];

    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  // get Wais
  async fetchWaisResult ({ id_results }) {
    const [rows] = await db.query(
      `SELECT wr.*,
              tr.status,
              tr.date_applied
      FROM wais_results wr
      JOIN test_results tr ON wr.id_results = tr.id_results
      WHERE wr.id_results = ?
      LIMIT 1`,
      [id_results]
    );
    return rows[0] ?? null;
  }

  // ================= REY ==================

  // Fetch existing REY result by id_results for modify/consult prefill
  async fetchREYResult ({ id_results }) {
    const [rows] = await db.query(
      `SELECT rr.*,
            tr.status,
            tr.date_applied
     FROM rey_results rr
     JOIN test_results tr ON rr.id_results = tr.id_results
     WHERE rr.id_results = ?
     LIMIT 1`,
      [id_results]
    );
    return rows[0] ?? null;
  }

  // Upserts into rey_results — works for register and modify.
  // Also updates test_results.status and date_applied.
  async saveREYResult ({
    id_results,
    score_rc,  pc_rc,  time_rc,  pc_time_rc,
    score_mcp, pc_mcp, time_mcp, pc_time_mcp,
    score_mlp, pc_mlp, time_mlp, pc_time_mlp,
    notes,
  }) {
  // Update parent row status and application date
    await db.query(
      `UPDATE test_results
     SET status       = 3,
         date_applied = CURDATE()
     WHERE id_results = ?`,
      [id_results]
    );

    // ON DUPLICATE KEY covers the modify flow (row already exists)
    await db.query(
      `INSERT INTO rey_results
       (id_results,
        score_rc,  pc_rc,  time_rc,  pc_time_rc,
        score_mcp, pc_mcp, time_mcp, pc_time_mcp,
        score_mlp, pc_mlp, time_mlp, pc_time_mlp,
        notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
        score_rc      = VALUES(score_rc),
        pc_rc         = VALUES(pc_rc),
        time_rc       = VALUES(time_rc),
        pc_time_rc    = VALUES(pc_time_rc),
        score_mcp     = VALUES(score_mcp),
        pc_mcp        = VALUES(pc_mcp),
        time_mcp      = VALUES(time_mcp),
        pc_time_mcp   = VALUES(pc_time_mcp),
        score_mlp     = VALUES(score_mlp),
        pc_mlp        = VALUES(pc_mlp),
        time_mlp      = VALUES(time_mlp),
        pc_time_mlp   = VALUES(pc_time_mlp),
        notes         = VALUES(notes)`,
      [
        id_results,
        score_rc  ?? null, pc_rc  ?? null, time_rc  ?? null, pc_time_rc  ?? null,
        score_mcp ?? null, pc_mcp ?? null, time_mcp ?? null, pc_time_mcp ?? null,
        score_mlp ?? null, pc_mlp ?? null, time_mlp ?? null, pc_time_mlp ?? null,
        notes     ?? null,
      ]
    );

    // Return the saved row for DTO mapping
    const [rows] = await db.query(
      'SELECT * FROM rey_results WHERE id_results = ?',
      [id_results]
    );
    return rows[0];
  }

    // ================= NIH ==================

  // Fetch existing NIH result by id_results for modify/consult prefill
  async fetchNihResult ({ id_results }) {
    const [rows] = await db.query(
      `SELECT nr.*,
            tr.status,
            tr.date_applied
     FROM nih_results nr
     JOIN test_results tr ON nr.id_results = tr.id_results
     WHERE nr.id_results = ?
     LIMIT 1`,
      [id_results]
    );
    return rows[0] ?? null;
  }

  // Upserts into nih_results — works for register and modify.
  async saveNihResult ({ id_results, notes }) {

    // Update parent row status and application date
    await db.query(
      `UPDATE test_results
     SET status       = 3,
         date_applied = CURDATE()
     WHERE id_results = ?`,
      [id_results]
    );

    // ON DUPLICATE KEY covers the modify flow (row already exists)
    await db.query(
      `INSERT INTO nih_results (id_results, notes)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE
       notes = VALUES(notes)`,
      [id_results, notes]
    );

    // Return the saved row for DTO mapping
    const [rows] = await db.query(
      'SELECT * FROM nih_results WHERE id_results = ?',
      [id_results]
    );
    return rows[0];
  }

  // ================= schooling and age ==================

  // Fetch schooling level for a user from their initial interview.
  // Used by MOCA use case to determine if +2 bonus applies.
  // Use by REY to determine the percentil
  async fetchUserSchooling ({ id_user }) {
    const [rows] = await db.query(
      `SELECT ii.schooling
       FROM initial_interview ii
       INNER JOIN user_relation ur ON ii.id_user_relation = ur.id_user_relation
       WHERE ur.id_user = ?
       LIMIT 1`,
      [id_user]
    );
    return rows.length ? rows[0].schooling : null;
  }

  // Fetch birthdate of user.
  async fetchUserAge ({ id_user }) {
    const [rows] = await db.query(
      `SELECT birthdate
       FROM users
       WHERE id_user = ?`,
      [id_user]
    );
    return rows.length ? rows[0].birthdate : null;
  }

}

module.exports = impTestResultsRepository;
