class getInterventionUseCase {
  constructor (interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute ({ id_user }) {
    if (!id_user) throw new Error('id_user es requerido');

    let intervention = await this.interventionRepository.findByUser({ id_user });

    // if  there's no intervention , creaate one
    if (!intervention) {
      await this.interventionRepository.createIntervention({ id_user });
      intervention = await this.interventionRepository.findByUser({ id_user });
    }

    const sessions = await this.interventionRepository.findSessionsByIntervention({
      id_intervention: intervention.idIntervention,
    });

    intervention.sessions = sessions;
    return intervention;
  }
}
module.exports = getInterventionUseCase;
