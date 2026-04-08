class LoginUseCase {

    constructor (authRepository, hashingService, jwtService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
    }

    async execute (username, password) {
        const user = await this.authRepository.findByUsername(username);
        if (!user) {
            throw new Error("Credenciales inválidas");
        }

        const isValid = await this.hashingService.compare(password, user.password);
        if (!isValid) {
            throw new Error ("Credenciales inválidas");
        }

        const payload = {userId: user.id, privileges: user.privileges};
        const token = this.jwtService.generateToken(payload);

        return token;
    }
}

module.exports = LoginUseCase;