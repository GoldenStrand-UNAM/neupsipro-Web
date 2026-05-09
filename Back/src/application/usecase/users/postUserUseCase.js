const UsersDTO = require('../../dto/usersDTO');

class PostUserUseCase {
    constructor (UserRepository, hashingService) {
        this.UserRepository = UserRepository;
        this.hashingService = hashingService;
    }

    async execute ({ idRole = 2, userName, firstName, lastnameP, lastnameM, birthdate, password, assigned, neuroStatus, basePathology, modality, profilePhoto, referenceNumber, laterality, prothesist, neuroEntryDate, amputationDate, pairs }) {
        const passwordHash = await this.hashingService.hash(password);
        
        // Entity validation
        const user = new User ({
        idRole,
        userName,
        firstName,
        lastnameP,
        lastnameM: lastnameM || null,
        birthdate,
        passwordHash,
        assigned,
        neuroStatus,
        basePathology,
        modality,
        profilePhoto: profilePhoto || null,
        referenceNumber,
        laterality,
        prothesist,
        neuroEntryDate,
        amputationDate,
        pairs,
        });

        const saved = await this.UserRepository.save(user);

        // Map saved into clean DTO for the client
        return UsersDTO.fromEntity(saved);
    }
}
module.exports = PostUserUseCase;