class LogoutUseCase {
  constructor (authService) {
    this.authService = authService;
  }

  async execute (token) {
    if (!token) return;

    return await this.authService.invalidateSession(token);
  }
}

module.exports = LogoutUseCase;
