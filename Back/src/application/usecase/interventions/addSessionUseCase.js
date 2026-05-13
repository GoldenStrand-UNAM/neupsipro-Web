class addSessionUseCase {
  constructor (interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute ({ id_user, session_number, session_date, objectives, development, dqp_task }) {
    if (!id_user) throw new Error('id_user es requerido');
    if (!session_date) throw new Error('La fecha de la sesión es requerida');

    const intervention = await this.interventionRepository.findByUser({ id_user });
    if (!intervention) throw new Error('No existe intervención activa');

    const idSession = await this.interventionRepository.createSession({
      id_intervention: intervention.idIntervention,
      session_number: session_number || null,
      session_date,
      objectives: objectives || null,
      development: development || null,
      dqp_task: dqp_task || null,
    });

    return { success: true, idSession, message: 'Sesión agregada' };
  }
}
module.exports = addSessionUseCase;
