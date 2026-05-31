class addSessionUseCase {
  constructor (interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute (data) {
    const { id_user, session_date } = data;

    if (!id_user) throw new Error('id_user es requerido');
    if (!session_date) throw new Error('La fecha de la sesión es requerida');

    const norm = (v) => (v == null || v === '' ? null : String(v).trim());

    const session_number = norm(data.session_number);
    const objectives     = norm(data.objectives);
    const development     = norm(data.development);
    const dqp_task       = norm(data.dqp_task);

    if (session_number && !/^\d+$/.test(session_number))
      throw new Error('El número de sesión solo puede contener dígitos');
    if (session_number && session_number.length > 20)
      throw new Error('El número de sesión no puede superar los 20 caracteres');

    if (objectives && objectives.length > 2000)
      throw new Error('Los objetivos no pueden superar los 2000 caracteres');
    if (development && development.length > 2000)
      throw new Error('El desarrollo no puede superar los 2000 caracteres');
    if (dqp_task && dqp_task.length > 2000)
      throw new Error('El DQP / tarea terapéutica no puede superar los 2000 caracteres');
    
    if (session_date && new Date(session_date) > new Date('2100-12-31'))
      throw new Error('La fecha de la sesión no puede ser posterior al año 2100');

    const intervention = await this.interventionRepository.findByUser({ id_user });
    if (!intervention) throw new Error('No existe intervención activa');



    const idSession = await this.interventionRepository.createSession({
      id_intervention: intervention.idIntervention,
      session_number,
      session_date,
      objectives,
      development,
      dqp_task,
    });

    return { success: true, idSession, message: 'Sesión agregada' };
  }
}
module.exports = addSessionUseCase;
