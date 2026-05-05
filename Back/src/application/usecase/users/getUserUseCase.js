const UserDTO = require('../../dto/userDTO');

class consultUserUseCase {
  constructor (userRepository, impTestApplicationRepository) {
    this.userRepository = userRepository;
    this.impTestApplicationRepository = impTestApplicationRepository;
  }

  async execute ({ id_user }) {

    const userEntities = await this.userRepository.fetchOne({ id_user });

    if (!userEntities || userEntities.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const user = userEntities[0];
    let assignedSessions = [];
    const hasProtocol = user.protocol && user.protocol !== 'Pending';
    if (hasProtocol) {
      assignedSessions = await this.impTestApplicationRepository.fetchTestApplications({ id_user });
    }
    const canStartIntervention = assignedSessions.some (session => session.sessionName === 'Sesión inicial' && session.status === 'Completada');

    const cleanUser = UserDTO.fromEntity(user);
    return {
      ...cleanUser,
      hasProtocol,
      assignedSessions,
      canStartIntervention,
    };
  }
}

module.exports = consultUserUseCase;
