class updateContractUseCase {
  constructor (interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute ({ id_user, contract_link, neuro_profile }) {
    if (!id_user) throw new Error('id_user es requerido');

    if (contract_link && contract_link.length > 500)  throw new Error('El enlace del contrato no puede superar los 500 caracteres');
    if (neuro_profile && neuro_profile.length > 2000) throw new Error('El perfil neuropsicológico no puede superar los 2000 caracteres');

    const intervention = await this.interventionRepository.findByUser({ id_user });
    if (!intervention) throw new Error('No existe intervención activa');

    const updated = await this.interventionRepository.updateContract({
      id_user,
      contract_link: contract_link || null,
      neuro_profile: neuro_profile || null,
    });

    if (!updated) throw new Error('No se pudo actualizar');

    return { success: true, message: 'Datos guardados' };
  }
}
module.exports = updateContractUseCase;
