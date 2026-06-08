class PeerSession {
  constructor (row = {}) {
    this.id = row.id_peer_session;
    this.title = row.title;
    this.responsable = row.responsable;
    this.note = row.note ?? null;
    this.date = row.session_date;
    this.menCount = Number(row.men_count) || 0;
    this.womenCount = Number(row.women_count) || 0;
  }
}

module.exports = PeerSession;
