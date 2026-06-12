class ConfigController {
  constructor (getMinSalaryUseCase, updateMinSalaryUseCase) {
    this.getMinSalaryUseCase = getMinSalaryUseCase;
    this.updateMinSalaryUseCase = updateMinSalaryUseCase;
  }

  // Get the current minimum salary config value
  async getMinSalary (req, res) {
    try {
      const result = await this.getMinSalaryUseCase.execute();

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update the minimum salary config value
  async updateMinSalary (req, res) {
    try {
      const { minSalary } = req.body;
      const { userId } = req.user;

      const result = await this.updateMinSalaryUseCase.execute({
        minSalary,
        updated_by: userId,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ConfigController;
