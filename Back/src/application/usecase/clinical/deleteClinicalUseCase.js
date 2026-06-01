class deleteClinicalUseCase {
  constructor (clinicalRepository) {
    this.clinicalRepository = clinicalRepository;
  }

  async execute ({ id_user }) {
    if (!id_user) {
      throw new Error('id_user is required');
    }

    const clinical = await this.clinicalRepository.fetchClinical({ id_user });

    if (!clinical || clinical.length === 0) {
      throw new Error('Clinical not found');
    }

    const deleted = await this.clinicalRepository.softDeleteUser({ id_user });

    if (!deleted) {
      throw new Error('Failed to delete clinical');
    }

    return {
      success: true,
      message: 'Clinical user deleted successfully',
    };
  }
}

module.exports = deleteClinicalUseCase;