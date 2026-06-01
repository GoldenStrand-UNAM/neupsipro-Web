class ImpFinancialInterviewRepository {

  // Fetch user id by reference number
  async fetchRefNum ({ id_user: _id_user }) {
    throw new Error('fetchUserId() must be implemented');
  }

  // Fetch relation by id
  async fetchRelation ({ id_user: _id_user }) {
    throw new Error('fetchRelation() must be implemented');
  }

  // Fetch interview progress by relation
  async fetchInterviewProgress ({ id_user_relation: _id_user_relation }) {
    throw new Error('fetchInterviewProgress() must be implemented');
  }

  // Fetch current section by relation
  async fetchFinancialProgress ({ id_user_relation: _id_user_relation }) {
    throw new Error('fetchFinancialProgress() must be implemented');
  }

  // Fetch financial situation by relation
  async fetchFinancialSituation ({ id_user_relation: _id_user_relation }) {
    throw new Error('fetchFinancialSituation() must be implemented');
  }

  // Fetch ESC Goverment by relation
  async fetchEscGov ({ id_user_relation: _id_user_relation }) {
    throw new Error('fetchEscGov() must be implemented');
  }

  // Fetch AMAI Wuestionary by relation
  async fetchAmaiQ ({ id_user_relation: _id_user_relation }) {
    throw new Error('fetchAmaiQ() must be implemented');
  }

  // Fetch results by relation
  async fetchResults ({ id_uid_user_relation: _id_user_relationser_relation }) {
    throw new Error('fetchResults() must be implemented');
  }
}

module.exports = ImpFinancialInterviewRepository;
