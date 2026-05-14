// Interface contract for test result persistence.
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

  //========= BANFE ========================
  async saveBANFEResult ({
    _id_results,
    _score_orbit_frontal,    _inter_orbit_frontal,
    _score_prefrontal_before, _inter_prefrontal_before,
    _score_d_lateral,        _inter_d_lateral,
    _score_total,
  }) {
    throw new Error('saveBANFEResult() not implemented');
  }

  async fetchBANFEResult ({ _id_results }) {
    throw new Error('fetchBANFEResult() not implemented');
  }

  //========= WAIS ========================

    async fetchWAISResult ({ _id_results }) {
      throw new Error('fetchWAISResult() not implemented');
    }

    async saveWAISResult ({
      _id_results,
      _score_com_verbal,       _inter_com_verbal,
      _score_razon_perceptual, _inter_razon_perceptual,
      _score_mem_work,         _inter_mem_work,
      _score_velo_proce,       _inter_velo_proce,
      _score_total,
      _notes,
    }) {
      throw new Error('saveWAISResult() not implemented');
    }


}

module.exports = resultRepository;
