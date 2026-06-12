const Validation = require('../../validations/validation');

const validator = new Validation();

class UpdateMinSalaryUseCase {
  constructor (systemConfigRepository) {
    this.systemConfigRepository = systemConfigRepository;
  }

  async execute ({ minSalary, updated_by }) {
    const value = validator.validateNumber({
      value: minSalary,
      label: 'El salario mínimo',
      required: true,
    });

    const config = await this.systemConfigRepository.updateMinSalary({
      value,
      updated_by,
    });

    return {
      minSalary: value,
      updatedAt: config?.updated_at,
    };
  }
}

module.exports = UpdateMinSalaryUseCase;
