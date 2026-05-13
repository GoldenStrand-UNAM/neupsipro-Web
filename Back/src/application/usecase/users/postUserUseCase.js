const User = require('../../../domain/entity/user')
const UsersDTO = require('../../dto/usersDTO');

class PostUserUseCase {
  constructor (userRepository, hashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  async execute ({ idRole = 2, userName, firstName, lastnameP, lastnameM, birthdate, password, assigned, phase, basePathology, otherPathology, modality, profilePhoto, referenceNumber, amputationDate, amputationLevel, otherLevel, laterality, prosthetist, neuroEntryDate, pairs, sex }) {
    const enumSex = {FEMALE: 'female', MALE: 'male'};
    const enumModality = {ROTARY: 'rotary', IN_PERSON: 'in person'};
    const enumLaterality = {LEFT: 'left', RIGHT: 'right', BOTH: 'both'};
    const enumPhase = {PRE: 'pre', PROSTHETIC: 'prosthetic', POST: 'post', EXERCISE_ADAPT: 'exerciseAdapt', DISCHARGE: 'discharge', DROPOUT: 'dropOut'};
    const pathology = others(basePathology, otherPathology);
    const level = others(amputationLevel, otherLevel);
    validate(userName, 30, "El nombre de usuario", true);
    validate(firstName, 30, "El nombre", true);
    validate(lastnameP, 30, "El apellido paterno", true);
    validate(lastnameM, 30, "EL apellido materno", false);
    validate(birthdate, 10, "El cumpleaños", true);
    validate(password, 20, "La contraseña", true);
    validate(assigned, 36, "El clínico asignado", true);
    validate(basePathology, 50, "La etiología de amputación", true);
    validate(profilePhoto, 300, "La URL de la foto de perfil", false);
    validate(referenceNumber, 10, "El folio", true);
    validate(amputationDate, 10, "La fecha de amputación", true);
    validate(amputationLevel, 20, "", true);
    validate(prosthetist, 20, "El/la protesista", true);
    validate(neuroEntryDate, 10, "La fecha de entrada a neuropsicología", true);
    validateEnum(sex, enumSex);
    validateEnum(modality, enumModality);
    validateEnum(laterality, enumLaterality);
    validateEnum(phase, enumPhase);
    const fBirthdate = formatDate(birthdate);
    const fAmputation = formatDate(amputationDate);
    const fNeuroEntry = formatDate(neuroEntryDate);
    const validPairs = validateBool(pairs, 'Pares ');

    const passwordHash = await this.hashingService.hash(password);   

    // Entity validation
    const user = new User ({
      idRole,
      userName,
      firstName,
      lastnameP,
      lastnameM: lastnameM || null,
      birthdate: fBirthdate,
      passwordHash,
      assigned,
      phase,
      basePathology: pathology,
      modality,
      profilePhoto: profilePhoto || null,
      referenceNumber,
      amputationDate: fAmputation,
      amputationLevel: level,
      laterality,
      prosthetist,
      neuroEntryDate: fNeuroEntry,
      pairs: validPairs,
      sex
    });

    function others(original, other){
      if (original = 'other') return other;
      else return original;
    }

    function validateBool(param, label) {
      var normalized;
      if(param == 'true' || true) normalized = true;
      else if(param == 'false' || false) normalized = false;
      else throw new Error(`${label} debe ser una opción de Sí o No`);
      return normalized;
    }

    function validateEnum(param, enumOptions) {
      if (!Object.values(enumOptions).includes(param.toLowerCase())) {
        throw new Error('Elige una opción disponible');
      }
    }

    function validate (param, requiredLength, label, required) {
        if(required && !null){
          if (!param || param.trim().length === 0) {
            throw new Error(label, ' debe llenarse');
          }
          if (param.trim().length > requiredLength) {
            throw new Error(`${label} no puede superar los ${requiredLength} caracteres`);
          }
        }
    }

    function formatDate (date) { 
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!date.match(regex)) throw new Error('Formato de fecha inválido');

      const [day, month, year] = date.split('/').map(Number);
    
      const inputDate = new Date(year, month - 1, day);
      const now = new Date();

      const isRealDate = inputDate.getFullYear() === year && 
                         inputDate.getMonth() === month - 1 && 
                         inputDate.getDate() === day;

      if (!isRealDate || inputDate >= now || year < 1900) {
        throw new Error('La fecha debe ser válida, anterior a hoy y después de 1900');
      }

      const isoYear = year;
      const isoMonth = String(month).padStart(2, '0');
      const isoDay = String(day).padStart(2, '0');

      return `${isoYear}-${isoMonth}-${isoDay}`;
    }
    console.log('usuario',user);

    const saved = await this.userRepository.postUser(user);

    // Map saved into clean DTO for the client
    return UsersDTO.fromEntity(saved);
  }
}
module.exports = PostUserUseCase;