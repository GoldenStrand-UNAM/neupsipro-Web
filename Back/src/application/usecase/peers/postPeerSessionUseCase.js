const PeerSession = require('../../../domain/entity/peerSession');
const PeerSessionDTO = require('../../dto/peerSessionDTO');
const validatePeerSession = require('../../validations/postSessionValidation');

class PostPeerSessionUseCase {
  constructor (peerSessionRepository) {
    this.peerSessionRepository = peerSessionRepository;
  }

  async execute (session) {
    const sanitized = Object.fromEntries(
      Object.entries(session)
        .filter(([key]) => key !== '__proto__' && key !== 'constructor')
        .map(([key, value]) => {
          if (typeof value === 'string') {
            const trimmed = value.trim();
            return [key, trimmed.length === 0 ? null : trimmed];
          }
          return [key, value];
        })
    );

    const validated = validatePeerSession(sanitized);

    const saved = await this.peerSessionRepository.postSession(validated);

    const entity = new PeerSession(saved);
    return PeerSessionDTO.fromEntity(entity);
  }
}

module.exports = PostPeerSessionUseCase;