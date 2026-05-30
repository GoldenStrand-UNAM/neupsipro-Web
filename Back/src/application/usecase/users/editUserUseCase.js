
const Validation       = require('../../../infrastructure/external/validations');
const { deleteFromS3 } = require('../../../infrastructure/external/s3.config');

const validation = new Validation();

const enumSex = { FEMENINE: 'Femenino', MASCULINE: 'Masculino', NOT_SPECIFIED: 'Sin especificar' };
const enumModality = { ONLINE: 'En línea', IN_PERSON: 'Presencial' };
const enumLaterality = { LEFT: 'Zurda', RIGHT: 'Diestra', BOTH: 'Ambidiestra' };
const enumPhase = { PRE: 'Preprotésico', PROSTHETIC: 'Protésico', POST: 'Postprotésico', EXERCISE_ADAPT: 'Adaptación al ejercicio', DISCHARGE: 'Alta', DROPOUT: 'Baja de neuropsicología' };
const enumPairs = { YES: 'Sí asiste', NO: 'No asiste' };
const enumProsthetist = { JUAN: 'CPO Juan David Orozco', ALEJANDRA: 'CPO Alejandra Santos', MELVIN: 'CPO Melvin Arévalo' };

class editUserUseCase {
  constructor (userRepository, hashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  async execute ({
    id_user,
    userName,
    firstName,
    lastnameP,
    lastnameM,
    birthdate,
    sex,
    email,
    phone,
    password,
    profilePhoto,
    referenceNumber,
    phase,
    basePathology,
    otherPathology,
    modality,
    pairs,
    assigned,
    neuroEntryDate,
    amputationDate,
    amputationLevel,
    laterality,
    prosthetist,
  }) {
    //  Validations
    const fpathology = validation.others(basePathology, otherPathology, 50, 'La etiología de amputación', true);
    const flevel = validation.validate(amputationLevel, 30, 'El nivel de amputación ', true);
    validation.validate(userName, 30, 'El nombre de usuario', true);
    const ffirstName = validation.validate(firstName, 30, 'El nombre', true);
    const flastnameP = validation.validate(lastnameP, 30, 'El apellido paterno', true);
    const flastnameM = validation.validate(lastnameM, 30, 'EL apellido materno', false);
    const femail = validation.validateEmail(email, 'El email', false);
    const fphone = validation.validate(phone, 16, 'El teléfono', false);
    const fpassword = validation.validate(password, 30, 'La contraseña', false);
    validation.validate(assigned, 36, 'El clínico asignado', true);
    validation.validate(profilePhoto, 255, 'La URL de la foto de perfil', false);
    const freferenceNumber = validation.validate(referenceNumber, 10, 'El folio', true);
    const fprosthetist = validation.validateEnum(prosthetist, enumProsthetist);
    const fsex = validation.validateEnum(sex, enumSex);
    const fmodality = validation.validateEnum(modality, enumModality);
    const flaterality = validation.validateEnum(laterality, enumLaterality);
    const fphase = validation.validateEnum(phase, enumPhase);
    const fpairs = validation.validateEnum(pairs, enumPairs);
    const fBirthdate = validation.validateDate(birthdate, 'La fecha de nacimiento ', true);
    const fAmputation = validation.validateDate(amputationDate, 'La fecha de amputación ', true);
    const fNeuroEntry = validation.validateDate(neuroEntryDate, 'La fecha de ingreso a neuropsicología ', false);

    //  if password is provided, hash it
    let passwordHash = null;
    if (fpassword) {
      passwordHash = await this.hashingService.hash(fpassword);
    }

    const current = await this.userRepository.fetchUserForEdit({ id_user });
    if (!current) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }
    const oldPhoto = current.profile_photo;

    const saved = await this.userRepository.editUser({
      id_user,
      userName,
      firstName: ffirstName,
      lastnameP: flastnameP,
      lastnameM: flastnameM || null,
      email: femail || null,
      phone: fphone || null,
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

    // delete old photo from s3
    if (profilePhoto && oldPhoto && oldPhoto !== profilePhoto) {
      await deleteFromS3(oldPhoto);
    }

    return saved;
  }
}

module.exports = editUserUseCase;
