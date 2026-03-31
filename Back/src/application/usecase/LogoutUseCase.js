class LogoutUseCase {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    execute(token) {
        if (!token) {
            throw new Error("Token requerido");
        }

        this.authRepository.invalidateSession(token);
    }
}

module.exports = LogoutUseCase;