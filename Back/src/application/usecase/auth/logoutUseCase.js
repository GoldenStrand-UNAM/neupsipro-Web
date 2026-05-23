class LogoutUseCase {
  constructor (authRepository) {
    this.authRepository = authRepository;
  }

  async execute (token) {
    if (!token) return;

    return await this.authRepository.invalidateSession(token);
  }
}

module.exports = LogoutUseCase;
