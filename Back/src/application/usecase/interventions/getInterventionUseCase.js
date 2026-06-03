const { getPresignedUrl } = require('../../../infrastructure/external/s3.config');

class getInterventionUseCase {
  constructor (interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute ({ id_user }) {
    if (!id_user) throw new Error('id_user es requerido');

    let intervention = await this.interventionRepository.findByUser({ id_user });

    // if  there's no intervention , create one
    if (!intervention) {
      await this.interventionRepository.createIntervention({ id_user });
      intervention = await this.interventionRepository.findByUser({ id_user });
    }

    const sessions = await this.interventionRepository.findSessionsByIntervention({
      id_intervention: intervention.idIntervention,
    });

    if (intervention.photo) {
      intervention.photo = await getPresignedUrl(intervention.photo);
    }

    intervention.sessions = sessions;
    return intervention;
  }
}
module.exports = getInterventionUseCase;
