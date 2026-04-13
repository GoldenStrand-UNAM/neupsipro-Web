const AuthDTO = require('../../dto/authDTO')
class LoginUseCase {

    constructor (authRepository, hashingService, jwtService, cacheService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
        this.cacheService = cacheService;
    }

    async execute (username, password) {
        const attempts = this.cacheService.getAttempts(username);
        if (attempts === 4) {
            throw new Error ('Límite de intentos de inicio de sesión alcanzados. Espera 15 minutos o contacta al administrador');
        }

        const user = await this.authRepository.findByUsername(username);
        //const privilegesDB = await this.privilegesRepository.getByUserId(user.idUser);
        //const privilegesArray = privilegesDB.map(priv => priv.permittedAction);
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

        this.cacheService.clearAttempts(username);

        const payload = {userId: userDto.idUser/*, privileges: privilegesArray*/};
        const token = this.jwtService.generateToken(payload);

        return token;
    }
}

module.exports = LoginUseCase;