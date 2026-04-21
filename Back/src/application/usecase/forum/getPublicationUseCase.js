const { getPresignedUrl } = require("../../../infrastructure/external/s3.config");
const postInteractionDTO = require("../../dto/postInteractionDTO");

class getPublicationUseCase {
    constructor (forumRepository, interactionRepository, userRepository) {
        this.forumRepository = forumRepository;
        this.interactionRepository = interactionRepository;
        this.userRepository = userRepository

    }
    async execute ({idPublication}) {

        const publication = await this.forumRepository.fetchOneUser({idPublication});

        const interactions = await this.interactionRepository.fetchAllFromOne({idPublication});

        const dto = new postInteractionDTO (publication[0], interactions[0]);

        const publicationPhotos = await Promise.all (publication[0].map(async publi => ({
                publicationUserPhoto: await getPresignedUrl(publi.profile_photo),
                publicationImage: await getPresignedUrl(publi.image),
            }))
        );
        const interactionPhotos = await Promise.all (
            interactions[0].map(async interaction => ({
                interactionUPhoto: await getPresignedUrl(interaction.profile_photo),
            }
        )) )

        return {dto, publicationPhotos, interactionPhotos};
    }

}
module.exports = getPublicationUseCase;
        
