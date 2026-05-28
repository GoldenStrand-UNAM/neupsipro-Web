
class modifyProtocolUseCase {
  constructor (userRepository) {
    this.userRepository = userRepository;
  }

  async execute ({ id_user, protocol }) {

    const updated = await this.userRepository.editUserProtocol({
      id_user,
      protocol,
    });

    return updated;
  }
}

module.exports = modifyProtocolUseCase;
