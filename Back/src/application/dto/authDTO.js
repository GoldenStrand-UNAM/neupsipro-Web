
class AuthDTO {
  constructor ({ id_user, id_role, user_name, first_name, lastname_p, lastname_m, email, profile_photo,
    birthdate, eliminated, password_hash, registration_date, last_day_activity, longest_streak,
    current_streak, reference_number,
  }) {
    this.idUser = id_user;
    this.idRole = id_role;
    this.userName = user_name;
    this.firstName = first_name;
    this.lastnameP = lastname_p;
    this.lastnameM = lastname_m;
    this.email = email;
    this.profilePhoto = profile_photo;
    this.birthdate = birthdate;
    this.eliminated = eliminated;
    this.passwordHash = password_hash;
    this.registrationDate = registration_date;
    this.lastDayActivity = last_day_activity;
    this.longestStreak = longest_streak;
    this.currentStreak = current_streak;
    this.referenceNumber = reference_number;
  }

  static fromEntity (entity) {
    return new AuthDTO ({
      id_user: entity.id_user,
      id_role: entity.id_role,
      user_name: entity.user_name,
      first_name: entity.first_name,
      lastname_p: entity.lastname_p,
      lastname_m: entity.lastname_m,
      email: entity.email,
      profile_photo: entity.profile_photo,
      birthdate: entity.birthdate,
      eliminated: entity.eliminated,
      password_hash: entity.password_hash,
      registration_date: entity.registration_date,
      last_day_activity: entity.last_day_activity,
      longest_streak: entity.longest_streak,
      current_streak: entity.current_streak,
      reference_number: entity.reference_number,

    });
  }
}

module.exports = AuthDTO;
