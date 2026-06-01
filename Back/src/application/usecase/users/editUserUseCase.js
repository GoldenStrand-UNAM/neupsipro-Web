
const Validation       = require('../../../infrastructure/external/validations');
const { deleteFromS3 } = require('../../../infrastructure/external/s3.config');
const validateUser = require('../../validations/postUserValidation');
const crypt = require('../../../infrastructure/crypt/users/postUser');

class editUserUseCase {
  constructor (userRepository, hashingService) {
    this.userRepository = userRepository;
    this.hashingService = hashingService;
  }

  async execute (data) {
    const sanitizedUser = Object.fromEntries(Object.entries(data)
      .filter(([key]) => key !== '__proto__' && key !== 'constructor')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          const trimmed = value.trim();
          return [key, trimmed.length === 0 ? null : trimmed];
        }
        return [key, value];
      }));

    //  Use case validation
    const validatedUser = validateUser(sanitizedUser);
    //  if password is provided, hash it
    let passwordHash = null;
    if (validatedUser.password) {
      passwordHash = await this.hashingService.hash(validatedUser.password);
    }

    const current = await this.userRepository.fetchUserForEdit({ id_user: data.id_user });
    if (!current) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }
    const oldPhoto = current.profile_photo;

    const cryptedUser = crypt(validatedUser);
    const duplicate = await this.userRepository.checkDuplicate(cryptedUser, data.id_user);
    if (duplicate) {
      if (duplicate.matched_bindex === 1)
          throw new Error("El usuario ya se encuentra registrado.");
      if (duplicate.matched_reference === 1)
          throw new Error("El número de referencia ya pertenece a otro usuario.");
      if (duplicate.matched_username === 1)
          throw new Error("El nombre de usuario ya está en uso.");
    }
    const saved = await this.userRepository.editUser({ ...cryptedUser, id_user: data.id_user, passwordHash });
    console.log(saved);

    // delete old photo from s3
    if (data.profilePhoto && oldPhoto && oldPhoto !== data.profilePhoto) {
      await deleteFromS3(oldPhoto);
    }

    return saved;
  }
}

module.exports = editUserUseCase;
