class LoginUseCase {

    constructor (authRepository, hashingService, jwtService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
    }

    execute (username, password) {
        const user = this.authRepository.findByUsername(username);
        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        const isValid = this.hashingService.compare(password, user.password);
        if (!isValid) {
            throw new Error ("Credenciales inválidas");
        }

        const payload = {userId: user.id, privileges: user.privileges};
        const token = this.jwtService.sign(payload, process.env.JWT_SECRET);

        return token;
    }
}

module.exports = LoginUseCase;