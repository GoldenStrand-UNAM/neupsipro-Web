class deleteUserUseCase {
  constructor (userRepository) {
    this.userRepository = userRepository;
  }

  async execute ({ id_user }) {
    if (!id_user) {
      throw new Error('id_user is required');
    }

    const userEntities = await this.userRepository.fetchOne({ id_user });

    if (!userEntities || userEntities.length === 0) {
      throw new Error('User not found');
    }

    const deleted = await this.userRepository.softDeleteUser({ id_user });

    if (!deleted) {
      throw new Error('Failed to delete user');
    }

    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}

module.exports = deleteUserUseCase;