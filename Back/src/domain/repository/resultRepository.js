class resultRepository {

  //Insert one result row per test linked to a session
  async createResults (_id_application, _id_user, _tests) {
    throw new Error('createResults() must be implemented');
  }

  //Fetch all test results scoped to a specific application
  async fetchTestsByApplication ({ _id_user, _id_application }) {
    throw new Error('fetchTestsByApplication() not implemented');
  }

  //Update an existing result row with score, interpretation, notes and status.
  async saveResult ({ _id_results, _score, _interpretation, _notes }) {
    throw new Error('saveResult() not implemented');
  }

  //Fetch a single result row to validate it exists before saving.
  async fetchResultRow ({ _id_user, _id_application, _id_test }) {
    throw new Error('fetchResultRow() not implemented');
  }

  //=================== STATUS =============================

  // Fetch all test statuses for an application
  async fetchTestStatusByApplication ({ _id_application }) {
    throw new Error('fetchTestStatusByApplication() not implemented');
  }

  // Expire all incomplete tests within an application
  async expireIncompleteTests ({ _id_application }) {
    throw new Error('expireIncompleteTests() not implemented');
  }

  // Fetch status and date_applied for all tests in an application
  async fetchTestsWithDateByApplication ({ _id_application }) {
    throw new Error('fetchTestsWithDateByApplication() not implemented');
  }

  //========= BANFE ========================
  async saveBanfeResult ({
    _id_results,
    _score_orbit_frontal,    _inter_orbit_frontal,
    _score_prefrontal_before, _inter_prefrontal_before,
    _score_d_lateral,        _inter_d_lateral,
    _score_total,
  }) {
    throw new Error('saveBanfeResult() not implemented');
  }

  async fetchBanfeResult ({ _id_results }) {
    throw new Error('fetchBanfeResult() not implemented');
  }

  //========= Wais ========================

  async fetchWaisResult ({ _id_results }) {
    throw new Error('fetchWaisResult() not implemented');
  }

  async saveWaisResult ({
    _id_results,
    _score_com_verbal,       _inter_com_verbal,
    _score_razon_perceptual, _inter_razon_perceptual,
    _score_mem_work,         _inter_mem_work,
    _score_velo_proce,       _inter_velo_proce,
    _score_total,
    _notes,
  }) {
    throw new Error('saveWaisResult() not implemented');
  }

  //========= Moca ========================

  async fetchMocaResult ({ _id_results }) {
    throw new Error('fetchMocaResult() not implemented');
  }

  async saveMocaResult ({
    _id_results,
    _score,
    _interpretation,
    _notes,
  }) {
    throw new Error('saveMocaResult() not implemented');
  }

  //========= REY ========================

  // Fetch existing REY result for modify/consult prefill
  async fetchREYResult ({ _id_results }) {
    throw new Error('fetchREYResult() not implemented');
  }

  // Upsert REY scores, percentiles, times and notes into rey_results.
  // Also updates test_results.status and date_applied.
  async saveREYResult ({
    _id_results,
    _score_rc,  _pc_rc,  _time_rc,  _pc_time_rc,
    _score_mcp, _pc_mcp, _time_mcp, _pc_time_mcp,
    _score_mlp, _pc_mlp, _time_mlp, _pc_time_mlp,
    _notes,
  }) {
    throw new Error('saveREYResult() not implemented');
  }

  // ========= MOCA & REY ========================

  // Fetch schooling level for a user from their initial interview.
  async fetchUserSchooling ({ _id_user }) {
    throw new Error('fetchUserSchooling() not implemented');
  }

  // Fetch birthdate of user.
  async fetchUserAge ({ _id_user }) {
    throw new Error('fetchUserAge() not implemented');
  }

  //========= NIH ========================

  // Fetch existing NIH result for modify/consult prefill
  async fetchNIHResult ({ _id_results }) {
    throw new Error('fetchNIHResult() not implemented');
  }

  // Upsert NIH notes into nih_results.
  // Also updates test_results.status and date_applied.
  async saveNIHResult ({ _id_results, _notes }) {
    throw new Error('saveNIHResult() not implemented');

  }

  async deleteAllResults ({ _id_application }) {
    throw new Error('deleteAllResults() not implemented');
  }

}

module.exports = resultRepository;
