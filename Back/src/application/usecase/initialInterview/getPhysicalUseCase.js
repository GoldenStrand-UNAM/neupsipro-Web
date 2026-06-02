const physicalConcernsDTO = require('../../dto/physicalConcernsDTO');

class GetPhysicalConcernsUseCase {
  constructor (physicalConcernsRepository) {
    this.physicalConcernsRepository = physicalConcernsRepository;
  }
  async execute ({ idUserRelation }) {
    const uncryptedRows = await this.physicalConcernsRepository.fetchPhysicalConcerns({ idUserRelation });
    const dto = new physicalConcernsDTO(uncryptedRows);
    return {
      dto,
    };
  }
}

module.exports = GetPhysicalConcernsUseCase;