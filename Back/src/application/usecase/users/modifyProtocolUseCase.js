class modifyProtocolUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ id_user, protocol }) {

    if (!id_user) {
      throw new Error('id_user is required');
    }

    const user =
      await this.userRepository.fetchOne({ id_user });

    if (!user || user.length === 0) {
      throw new Error('User not found');
    }
    const VALID_PROTOCOLS = ['Clinical', 'Research'];
    if (!VALID_PROTOCOLS.includes(protocol)) {
      throw new Error(`Invalid protocol. Must be one of: ${VALID_PROTOCOLS.join(', ')}`);
    }


    const updated =
      await this.userRepository.editUserProtocol({
        id_user,
        protocol,
      });

    return updated;
  }
}

module.exports = modifyProtocolUseCase;