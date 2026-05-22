const User = require('../../../domain/entity/postUser');
const UsersDTO = require('../../dto/postUsersDTO');
const Validation = require('../../../infrastructure/external/validations');

const validation = new Validation();

const enumSex = { FEMENINE: 'Femenino', MASCULINE: 'Masculino', NOT_SPECIFIED: 'Sin especificar' };
const enumModality = { ROTARY: 'Rotaria', IN_PERSON: 'Presencial' };
const enumLaterality = { LEFT: 'Zurda', RIGHT: 'Diestra', BOTH: 'Ambidiestra' };
const enumPhase = { PRE: 'Preprotésico', PROSTHETIC: 'Protésico', POST: 'Postprotésico', EXERCISE_ADAPT: 'Adaptación al ejercicio', DISCHARGE: 'Alta', DROPOUT: 'Baja de neuropsicología' };
const enumPairs = { YES: 'Sí asiste', NO: 'No asiste' };

class PostUserUseCase {
  constructor (userRepository, hashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  async execute ({
    userName,
    firstName,
    lastnameP,
    lastnameM,
    birthdate,
    password,
    assigned,
    phase,
    basePathology,
    otherPathology,
    modality,
    profilePhoto,
    referenceNumber,
    amputationDate,
    amputationLevel,
    otherLevel,
    laterality,
    prosthetist,
    neuroEntryDate,
    pairs,
    sex,
  }) {
    const fpathology = validation.others(basePathology, otherPathology, 50, 'La etiología de amputación', true);
    const flevel = validation.others(amputationLevel, otherLevel, 'El nivel de amputación ', true);
    validation.validate(userName, 30, 'El nombre de usuario', true);
    const ffirstName = validation.validate(firstName, 30, 'El nombre', true);
    const flastnameP = validation.validate(lastnameP, 30, 'El apellido paterno', true);
    const flastnameM = validation.validate(lastnameM, 30, 'EL apellido materno', false);
    validation.validate(password, 30, 'La contraseña', true);
    validation.validate(assigned, 36, 'El clínico asignado', true);
    validation.validate(profilePhoto, 255, 'La URL de la foto de perfil', false);
    const freferenceNumber = validation.validate(referenceNumber, 10, 'El folio', true);
    const fprosthetist = validation.validate(prosthetist, 20, 'El/la protesista', true);
    const fsex = validation.validateEnum(sex, enumSex);
    const fmodality = validation.validateEnum(modality, enumModality);
    const flaterality = validation.validateEnum(laterality, enumLaterality);
    const fphase = validation.validateEnum(phase, enumPhase);
    const fpairs = validation.validateEnum(pairs, enumPairs);
    const fBirthdate = validation.validateDate(birthdate, 'La fecha de nacimiento ', true);
    const fAmputation = validation.validateDate(amputationDate, 'La fecha de amputación ', true);
    const fNeuroEntry = validation.validateDate(neuroEntryDate, 'La fecha de ingreso a neuropsicología ', false);
    const passwordHash = await this.hashingService.hash(password);

    // Entity validation
    const user = new User ({
      idRole: 2,
      userName,
      firstName: ffirstName,
      lastnameP: flastnameP,
      lastnameM: flastnameM || null,
      birthdate: fBirthdate,
      passwordHash,
      assigned,
      phase: fphase,
      basePathology: fpathology,
      modality: fmodality,
      profilePhoto: profilePhoto || null,
      referenceNumber: freferenceNumber,
      amputationDate: fAmputation,
      amputationLevel: flevel,
      laterality: flaterality,
      prosthetist: fprosthetist,
      neuroEntryDate: fNeuroEntry || null,
      pairs: fpairs,
      sex: fsex,
    });

    const saved = await this.userRepository.postUser(user);

    // Map saved into clean DTO for the client
    return UsersDTO.fromEntity(saved);
  }
}
module.exports = PostUserUseCase;
