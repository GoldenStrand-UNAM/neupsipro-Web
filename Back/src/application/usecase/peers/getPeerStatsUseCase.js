class GetPeerStatsUseCase {
  constructor (peerSessionRepository) {
    this.peerSessionRepository = peerSessionRepository;
  }

  async execute () {
    const rows = await this.peerSessionRepository.fetchAllForStats();

    // gender
    const genderSeries = rows.map(row => ({
      date: row.session_date,
      title: row.title,
      men: Number(row.men_count) || 0,
      women: Number(row.women_count) || 0,
    }));

    // attendance 
    const attendanceSeries = rows.map(row => ({
      date: row.session_date,
      total: (Number(row.men_count) || 0) + (Number(row.women_count) || 0),
    }));

    // KPIs
    const totalSessions = rows.length;
    const totalMen = rows.reduce((acc, r) => acc + (Number(r.men_count) || 0), 0);
    const totalWomen = rows.reduce((acc, r) => acc + (Number(r.women_count) || 0), 0);
    const totalAttendees = totalMen + totalWomen;
    const avgPerSession = totalSessions
      ? Math.round(totalAttendees / totalSessions)
      : 0;

    return {
      genderSeries,
      attendanceSeries,
      kpis: {
        totalSessions,
        totalMen,
        totalWomen,
        totalAttendees,
        avgPerSession,
      },
    };
  }
}

module.exports = GetPeerStatsUseCase;
