class User {
  constructor (data) {
    this.idUser = data.id_user;
    this.photo = data.profile_photo;
    this.referenceNumber = data.reference_number;
    this.name = [data.first_name, data.lastname_p, data.lastname_m]
      .filter(Boolean)
      .join(' ');
    this.email = data.email;
    this.age = this.calculateAge(data.birthdate);
    this.registrationDate = data.registration_date;
    this.phase = data.neuro_status;
    this.assignedClinic = data.assigned_clinic;
    this.modality = data.modality;
    this.attendance = data.attendance;
    this.amputationDate = this.formatDate(data.amputation_date);
    this.state = data.state;
    this.amputationEtiology = data.base_patology;
    this.prosthetist = data.prosthetist;
    this.neuroEntryDate = this.formatDate(data.neuro_entry_date);
    this.amputationLevel = data.amputation_level;
    this.nextAppointment = data.next_appointment;
    this.laterality = data.laterality;
    this.groupIntervention = data.group_intervention;
    this.initialInterview = this.getStatus(data.initial_interview);
    this.protocol = this.setProtocol(data.protocol);
    this.phone = data.phone;
  }

  calculateAge (birthdate) {
    if (!birthdate) return null;

    const [day, month, year] = birthdate.split('/');

    const birth = new Date(year, month - 1, day);
    if (isNaN(birth.getTime())) return null;

    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const daysInPreviousMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      days += daysInPreviousMonth;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} años, ${months} meses y ${days} días`;
  }

  formatDate (rawDate) {
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

  getStatus (status) {
    if (!status) return null;

    switch (status) {
      case 1:
        return 'Por comenzar';
      case 2:
        return 'En proceso';
      case 3:
        return 'Terminada';
    }
  }

  setProtocol (protocol) {
    if (!protocol) {
      return null;
    }
    if (protocol === 'Clinical' || protocol === 'clinical') {
      return 'Clínico';
    }
    if (protocol === 'Research' || protocol === 'research') {
      return 'Investigación';
    }
    if (protocol === 'Pending' || protocol === 'research') {
      return 'Pendiente';
    }
  }
}

module.exports = User;
