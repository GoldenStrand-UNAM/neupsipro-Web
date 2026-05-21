class listClinicsController {
  constructor (listClinicsUseCase) {
    this.listClinicsUseCase = listClinicsUseCase;
  }

  async listClinics (req, res) {
    try {
      const clinics = await this.listClinicsUseCase.execute();
      return res.status(200).json(clinics);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = listClinicsController;
