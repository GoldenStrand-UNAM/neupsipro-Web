const PeerSessionDTO = require('../../dto/peerSessionDTO');

class GetPeerSessionsUseCase {
  constructor (peerSessionRepository) {
    this.peerSessionRepository = peerSessionRepository;
  }

  async execute ({ page = 1, limit = 4, from = null, to = null }) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 4);

    const [rows, total] = await Promise.all([
      this.peerSessionRepository.fetchSessions({ page: safePage, limit: safeLimit, from, to }),
      this.peerSessionRepository.countSessions({ from, to }),
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
      sessions: rows.map(row => PeerSessionDTO.fromEntity(row)),
      page: safePage,
      totalPages,
      total,
    };
  }
}

module.exports = GetPeerSessionsUseCase;