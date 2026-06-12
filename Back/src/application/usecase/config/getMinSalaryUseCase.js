class GetMinSalaryUseCase {
  constructor (systemConfigRepository) {
    this.systemConfigRepository = systemConfigRepository;
  }

  async execute () {
    const config = await this.systemConfigRepository.fetchMinSalary();

    return {
      minSalary: Number(config?.config_value),
    };
  }
}

module.exports = GetMinSalaryUseCase;
