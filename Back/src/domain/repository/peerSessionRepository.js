class peerSessionRepository {
  async postSession (_session) {
    throw new Error('postSession() must be implemented');
  }
  async deleteSession (_id_peer_session) {
    throw new Error('deleteSession() must be implemented');
  }
  async fetchSessions ({ _page, _limit, _from, _to }) {
    throw new Error('fetchSessions() must be implemented');
  }
  async countSessions ({ _from, _to }) {
    throw new Error('countSessions() must be implemented');
  }
  async fetchAllForStats () {
    throw new Error('fetchAllForStats() must be implemented');
  }
}

module.exports = peerSessionRepository;
