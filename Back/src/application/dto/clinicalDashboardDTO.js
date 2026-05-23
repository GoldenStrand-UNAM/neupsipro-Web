class clinicalDashboardDTO {
  constructor (numbers, users, today, tomorrow, other, historicalNumbers) {
    this.numbers = new numberUsersWithClinicalDTO(numbers),
    this.users = new userWithClinicalDTO(users),
    this.appointmentsToday = new appointmentsDTO(today),
    this.appointmentsTomorrow = new appointmentsDTO(tomorrow),
    this.appointmentsOther = new appointmentsDTO(other),
    this.historicalNumbers = new numberUsersWithClinicalDTO(historicalNumbers);
  }
}

class numberUsersWithClinicalDTO {
  constructor (numbers) {
    this.total = numbers.total_users;
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
      date: appointmentsDTO._formatDate(appointment.date_time),
      name: appointment.full_name,
      day: appointment.day_separation,
      issue: appointment.issue,
    }));
  }
  static _formatDate (d) {
    if (!d) return null;
    const date = new Date(d);
    const m = String(date.getMinutes()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${hh}:${m} - ${dd}/${mm}/${yyyy}`;
  }
}

class userInfoDTO {
  constructor (userInfo) {
    this.idUser = userInfo.id_user;
    this.referenceNumber = userInfo.reference_number;
    this.fullName = userInfo.full_name;
    this.age = userInfoDTO._calculateAge(userInfo.birthdate);
    this.pp = userInfo.profile_photo;
    this.schooling = userInfo.schooling;
    this.unitEntryDate = userInfoDTO._formatDate(userInfo.registration_date);
    this.neuroEntryDate = userInfoDTO._formatDate(userInfo.neuro_entry_date);
    this.amputationDate = userInfoDTO._formatDate(userInfo.amputation_date);
    this.protocol = userInfo.protocol;
  }
  static _calculateAge (birthdate) {
    if (!birthdate) return null;
    let d;
    if (typeof birthdate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(birthdate)) {
      const [day, month, year] = birthdate.split('/').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(birthdate);
    }
    if (isNaN(d.getTime())) return null;
    const now = new Date();
    let years = now.getFullYear() - d.getFullYear();
    let months = now.getMonth() - d.getMonth();
    let days  = now.getDate() - d.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return { years, months, days };
  }
  static _formatDate (rawDate) {
    if (!rawDate) return null;
    let date;
    if (typeof rawDate === 'string' && /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(rawDate)) {
      const [day, month, year] = rawDate.split('/').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(rawDate);
    }
    if (isNaN(date.getTime())) return null;
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
}

module.exports = {
  clinicalDashboardDTO,
  numberUsersWithClinicalDTO,
  userWithClinicalDTO,
  appointmentsDTO,
  userInfoDTO,
};
