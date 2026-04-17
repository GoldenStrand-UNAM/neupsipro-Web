const AuthDTO = require('../../dto/authDTO')
class LoginUseCase {

    // eslint-disable-next-line max-params
    constructor (authRepository, hashingService, jwtService, cacheService, sessionRepository) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
        this.cacheService = cacheService;
        this.sessionRepository = sessionRepository;
    }

    // eslint-disable-next-line max-params
    async execute (username, password, ipAddress, userAgent) {
        const attempts = this.cacheService.getAttempts(username);
        if (attempts === 4) {
            throw new Error ('Límite de intentos de inicio de sesión alcanzados. Espera 15 minutos o contacta al administrador');
        }

        const user = await this.authRepository.findByUsername(username);

        if (!user) {
            this.cacheService.incrementAttempts(username);
            throw new Error ("Credenciales inválidas");
        }

        const userDto = AuthDTO.fromEntity(user);

        if (userDto.eliminated) {
            throw new Error ('Esta cuenta ha sido desactivada');
        }

        const isValid = await this.hashingService.compare(password, userDto.passwordHash);
        if (!isValid) {
            this.cacheService.incrementAttempts(username);
            throw new Error ("Credenciales inválidas");
        }

        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 2);

        const idSession = await this.sessionRepository.createSession({
            userId: userDto.idUser,
            ipAddress: ipAddress,
            userAgent: userAgent,
            expiresAt: expiresAt,
        });

        this.cacheService.clearAttempts(username);

        const payload = {userId: userDto.idUser, session: idSession};
        const token = this.jwtService.generateToken(payload);

        return token;
    }
}

module.exports = LoginUseCase;