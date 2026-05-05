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
    let assignedApplications = [];
    const hasProtocol = user.protocol && user.protocol !== 'Pending';
    if (hasProtocol) {
      assignedApplications = await this.impTestApplicationRepository.fetchTestApplications({ id_user });
    }
    const canStartIntervention = assignedApplications.some (session => session.sessionName === 'Sesión inicial' && session.status === 'Completada');

    const cleanUser = UserDTO.fromEntity(user);
    return {
      ...cleanUser,
      hasProtocol,
      assignedApplications,
      canStartIntervention,
    };
  }
}

module.exports = consultUserUseCase;
