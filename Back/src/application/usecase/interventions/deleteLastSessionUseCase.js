class deleteLastSessionUseCase {
  constructor (interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute ({ id_user, id_session }) {
    if (!id_user)    throw new Error('id_user es requerido');
    if (!id_session) throw new Error('id_session es requerido');

    const intervention = await this.interventionRepository.findByUser({ id_user });
    if (!intervention) throw new Error('No existe intervención activa');

    const lastSession = await this.interventionRepository.findLastSession({
      id_intervention: intervention.idIntervention,
    });

    if (!lastSession) throw new Error('No hay sesiones para eliminar');

    if (lastSession.idSession !== id_session) {
      throw new Error('Solo se puede eliminar la última sesión registrada');
    }

    const deleted = await this.interventionRepository.deleteSession({ id_session });
    if (!deleted) throw new Error('No se pudo eliminar la sesión');

    return { success: true, message: 'Sesión eliminada' };
  }
}
module.exports = deleteLastSessionUseCase;
