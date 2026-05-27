class modifyStateUseCase {
  constructor (userRepository) {
    this.userRepository = userRepository;
  }

  async execute ({ id_user, state }) {

    const updated = await this.userRepository.editUserState({
      id_user,
      state: state,
    });

    return updated;
  }
}

module.exports = modifyStateUseCase;