class PostClinicalUserUseCase {
  constructor (clinicalUserRepository, hashingService) {
    this.clinicalUserRepository = clinicalUserRepository;
    this.hashingService = hashingService;
  }

  async execute (user) {
    const sanitizedUser = Object.fromEntries(Object.entries(user)
      .filter(([key]) => key !== '__proto__' && key !== 'constructor')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          const trimmed = value.trim();
          return [key, trimmed.length === 0 ? null : trimmed];
        }
        return [key, value];
      }));
    // Password hashing
    const passwordHash = await this.hashingService.hash(user.password);

    const duplicate = await this.clinicalUserRepository.checkDuplicate(sanitizedUser);
    if (duplicate)
      throw new Error('El usuario ya se encuentra registrado.');
    else {
      const saved = await this.clinicalUserRepository.postUser({ ...sanitizedUser, passwordHash });
      return saved;
    }
  }
}
module.exports = PostClinicalUserUseCase;
