class clinicalDashboardDTO {
  constructor (numbers, users, appointments) {
    this.numbers = new numberUsersWithClinicalDTO(numbers),
    this.users = new userWithClinicalDTO(users),
    this.appointments = new appointmentsDTO(appointments);
  }
}

class numberUsersWithClinicalDTO {
  constructor (numbers) {
    this.discharged = numbers.discharged;
    this.inIntervention = numbers.in_intervention;
    this.standBy = numbers.stand_by;
    this.clinical = numbers.clinical;
    this.research = numbers.research;
    this.noProtocol = numbers.no_protocol;
  }
}

class userWithClinicalDTO {
  constructor (users) {
    this.usersList = users.map (user => ({
      idUser: user.id_user,
      firstName: user.first_name,
      lastnameP: user.lastname_p,
      lastnameM: user.lastname_m,
    }));
  }
}

class appointmentsDTO {
  constructor (appointments) {
    this.appointmentsList = appointments.map (appointment => ({
      idAppointment: appointment.id_appointment,
      date: appointment.date_time,
      name: appointment.full_name,
    }));
  }
}

class userInfoDTO {
  constructor (userInfo) {
    this.idUser = userInfo.id_user;
    this.referenceNumber = userInfo.reference_number;
    this.fullName = userInfo.full_name;
    this.birthdate = userInfo.birthdate;
    this.pp = userInfo.profile_photo;
    this.schooling = userInfo.schooling;
    this.unitEntryDate = userInfo.unit_entry_date;
    this.neuroEntryDate = userInfo.neuro_entry_date;
    this.amputationDate = userInfo.amputation_date;
    this.protocol = userInfo.protocol;
  }
}

module.exports = {
  clinicalDashboardDTO,
  numberUsersWithClinicalDTO,
  userWithClinicalDTO,
  appointmentsDTO,
  userInfoDTO,
};
