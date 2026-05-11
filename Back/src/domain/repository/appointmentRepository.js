class appointmentRepository {
  async findUpcomingByUser ({ _id_user }) {
    throw new Error('findUpcomingByUser() must be implemented');
  }
  async createAppointment ({ _id_user_relation, _issue, _date_time }) {
    throw new Error('createAppointment() must be implemented');
  }
  async findOrCreateUserRelation ({ _id_user, _id_clinic_user }) {
    throw new Error('findOrCreateUserRelation() must be implemented');
  }
  async deleteUpcomingByUser ({ _id_user }) {
  throw new Error('deleteUpcomingByUser() must be implemented');
}
}
module.exports = appointmentRepository;