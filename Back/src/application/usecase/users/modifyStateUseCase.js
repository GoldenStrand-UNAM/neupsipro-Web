class modifyStateUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ id_user, state }) {

    if (!state || state.trim() === '') {
      return null;
    }

    const stateMap = {
      'Active': 'Active',

      'Stand_by': 'Stand_by',  
      'Stand by': 'Stand_by',  
      'Stand By': 'Stand_by',   

      'Discharged': 'Discharged',
      'Declined': 'Declined',
    };

    const normalizedState = stateMap[state];

    if (!normalizedState) {
      throw new Error('Invalid state');
    }

    return this.userRepository.editUserState({
      id_user,
      state: normalizedState,
    });
  }
}

module.exports = modifyStateUseCase;