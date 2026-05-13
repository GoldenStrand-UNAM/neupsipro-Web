const UserDTO = require('../../dto/userDTO');
const { getPresignedUrl } = require('../../../infrastructure/external/s3.config');

class consultUserUseCase {
  constructor (userRepository, impTestApplicationRepository, appointmentRepository) {
    this.userRepository = userRepository;
    this.impTestApplicationRepository = impTestApplicationRepository;
    this.appointmentRepository = appointmentRepository; 
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
    const canStartIntervention = assignedApplications.some(a =>
      a.status === 'Entregado');

    const cleanUser = UserDTO.fromEntity(user);

    const resolvedPhotoUrl = cleanUser.photo
      ? await getPresignedUrl(cleanUser.photo)
      : cleanUser.photo;

      const nextAppointment = await this.appointmentRepository.findUpcomingByUser({ id_user });

    return {
      ...cleanUser,
      photo: resolvedPhotoUrl,
      hasProtocol,
      assignedApplications,
      canStartIntervention,
      nextAppointment, 
    };

  }
}

module.exports = consultUserUseCase;
