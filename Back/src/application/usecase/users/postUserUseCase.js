const User = require('../../../domain/entity/postUser');
const UsersDTO = require('../../dto/postUsersDTO');
const validateUser = require('../../validations/postUserValidation');
const crypt = require('../../../infrastructure/crypt/users/postUser');

class PostUserUseCase {
  constructor (userRepository, hashingService) {
    this.userRepository = userRepository;
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

    // Use Case validation
    const validatedUser = validateUser(sanitizedUser);
    // Entity validation
    const user = new User (validatedUser);

    const cryptedUser = crypt(user);
    const duplicate = await this.userRepository.checkDuplicate(cryptedUser);
    if (duplicate) {
      if (duplicate.matched_bindex === 1)
          throw new Error("El usuario ya se encuentra registrado.");
      if (duplicate.matched_reference === 1)
          throw new Error("El número de referencia ya pertenece a otro usuario.");
    }
      const saved = await this.userRepository.postUser(cryptedUser);
      // Map saved into clean DTO for the client
      return UsersDTO.fromEntity(saved);
  }
}
module.exports = PostUserUseCase;
