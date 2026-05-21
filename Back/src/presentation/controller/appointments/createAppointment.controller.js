class createAppointmentController {
  constructor (createAppointmentUseCase) {
    this.createAppointmentUseCase = createAppointmentUseCase;
  }

  async createAppointment (req, res) {
    try {
      const { id_user } = req.params;
      const { id_clinic_user, issue, date_time } = req.body;

      const result = await this.createAppointmentUseCase.execute({
        id_user,
        id_clinic_user,
        issue,
        date_time,
      });

      return res.status(201).json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = createAppointmentController;
