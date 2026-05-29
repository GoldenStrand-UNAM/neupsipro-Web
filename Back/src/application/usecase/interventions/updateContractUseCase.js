class updateContractUseCase {
  constructor (interventionRepository) {
    this.interventionRepository = interventionRepository;
  }

  async execute (data) {
    const { id_user } = data;
    if (!id_user) throw new Error('id_user es requerido');

    const norm = (v) => (v == null || v === '' ? null : String(v).trim());

    const contract_link = norm(data.contract_link);
    const neuro_profile = norm(data.neuro_profile);

    if (contract_link && contract_link.length > 250)
      throw new Error('El enlace del contrato no puede superar los 250 caracteres');
    if (neuro_profile && neuro_profile.length > 2000)
      throw new Error('El perfil neuropsicológico no puede superar los 2000 caracteres');

    const intervention = await this.interventionRepository.findByUser({ id_user });
    if (!intervention) throw new Error('No existe intervención activa');

    const updated = await this.interventionRepository.updateContract({
      id_user,
      contract_link,
      neuro_profile,
    });

    if (!updated) throw new Error('No se pudo actualizar');

    return { success: true, message: 'Datos guardados' };
  }
}
module.exports = updateContractUseCase;