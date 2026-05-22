const ClinicalUser = require('../../../domain/entity/postClinicalUser');
const ClinicalUserDTO = require('../../dto/postClinicalUserDTO');
const Validation = require('../../../infrastructure/external/validations');
const validation = new Validation();

class PostClinicalUserUseCase {
  constructor (clinicalUserRepository, hashingService) {
    this.clinicalUserRepository = clinicalUserRepository;
    this.hashingService = hashingService;
  }

  async execute ({
    idRole,
    firstName,
    lastnameP,
    lastnameM,
    birthdate,
    email,
    affiliation,
    activity,
    startDate,
    finishDate,
    hours,
    username,
    password,
    emergencyContactName,
    emergencyContactPhone,
    emergencyContactRelation,
  }) {
    const fFirstName = validation.validate(firstName, 30, 'El nombre', true);
    const fLastnameP = validation.validate(lastnameP, 30, 'El apellido paterno', true);
    const fLastnameM = validation.validate(lastnameM, 30, 'El apellido materno', false);
    const fBirthdate = validation.validateDate(birthdate, 'La fecha de nacimiento ', true);
    const fEmail = validation.validate(email, 50, 'El email', false);
    const fAffiliation = validation.validate(affiliation, 20, 'La afiliación', true);
    const fActivity = validation.validate(activity, 20, 'La afiliación', true);
    const fStartDate = validation.validateDate(startDate, 'La fecha de inicio', false);
    const fFinishDate = validation.validateFutureDate(finishDate, 'La fecha de fin', false);
    const fHours = validation.validateNumber(hours, 'Las horas', 9999, false);
    validation.validate(username, 30, 'El nombre de usuario', true);
    validation.validate(password, 30, 'La contraseña', true);
    const fEmergencyName = validation.validate(emergencyContactName, 50, 'El nombre del contacto de emergencia', false);
    const fEmergencyPhone = validation.validatePhone(emergencyContactPhone, 'El número del contacto de emergencia', false);
    const fEmergencyRelation = validation.validate(emergencyContactRelation, 25, 'La relación del contacto de emergencia', false);
    const passwordHash = await this.hashingService.hash(password);

    // Entity validation
    const clinicalUser = new ClinicalUser ({
      idRole: 3,
      firstName: fFirstName,
      lastnameP: fLastnameP,
      lastnameM: fLastnameM,
      birthdate: fBirthdate,
      email: fEmail,
      affiliation: fAffiliation,
      activity: fActivity,
      startDate: fStartDate,
      finishDate: fFinishDate,
      hours: fHours,
      username,
      passwordHash: passwordHash,
      emergencyContactName: fEmergencyName,
      emergencyContactPhone: fEmergencyPhone,
      emergencyContactRelation: fEmergencyRelation,
    });

    const duplicate = await this.clinicalUserRepository.checkDuplicate(clinicalUser);

    if (duplicate) {
      throw new Error("El usuario ya se encuentra registrado.");
    } else {
      const saved = await this.clinicalUserRepository.postUser(clinicalUser);
      // Map saved into clean DTO for the client
      return ClinicalUserDTO.fromEntity(saved);
    }
  }
}
module.exports = PostClinicalUserUseCase;