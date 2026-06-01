class deleteSessionUseCase {
  constructor (interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute ({ id_user, id_session }) {
    if (!id_user)    throw new Error('id_user es requerido');
    if (!id_session) throw new Error('id_session es requerido');

    const intervention = await this.interventionRepository.findByUser({ id_user });
    if (!intervention) throw new Error('No existe intervención activa');

    const session = await this.interventionRepository.findSessionById({ id_session });
    if (!session || session.idIntervention !== intervention.idIntervention) {
      throw new Error('La sesión no existe o no pertenece a este usuario');
    }

    const deleted = await this.interventionRepository.deleteSession({ id_session });
    if (!deleted) throw new Error('No se pudo eliminar la sesión');

    return { success: true, message: 'Sesión eliminada' };
  }
}
module.exports = deleteSessionUseCase;