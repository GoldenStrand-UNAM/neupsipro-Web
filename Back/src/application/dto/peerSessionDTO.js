class PeerSessionDTO {
  constructor ({ id_peer_session, title, responsable, note, session_date, men_count, women_count }) {
    this.id = id_peer_session;
    this.title = title;
    this.responsable = responsable;
    this.note = note ?? null;
    this.date = session_date;
    this.menCount = Number(men_count);
    this.womenCount = Number(women_count);
    this.total = Number(men_count) + Number(women_count);
  }

  static fromEntity (row) {
    return new PeerSessionDTO(row);
  }
}

module.exports = PeerSessionDTO;