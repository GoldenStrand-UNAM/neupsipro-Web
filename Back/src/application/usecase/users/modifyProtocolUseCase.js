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
    if (!protocol) {
      throw new Error('Protocol is required');
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