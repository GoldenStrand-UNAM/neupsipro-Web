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
        const interactionComments = await this.interactionRepository.fetchAllFromOne({idPublication});

        const numberLikes = await this.interactionRepository.fetchLikes({idPublication});

        const numberComments = await this.interactionRepository.fetchComments({idPublication});

        const publicationComplete = await Promise.all (publication[0].map(async publi => ({
            ...publi,
            userPhoto: await getPresignedUrl(publi.profile_photo),
            postPhoto: await getPresignedUrl(publi.image),
            })));

        const interactionComplete = await Promise.all (interactionComments[0].map(async interaction => ({
            ...interaction,
            interactionUPhoto: await getPresignedUrl(interaction.profile_photo),
            })));
        if (publication[0].length != 0) {
            const dto = new postInteractionDTO (
                true,
                publicationComplete,
                interactionComplete,
                numberLikes[0],
                numberComments[0]
            );
            return {dto};
        }

        else {
                const dto = new postInteractionDTO (
                false,
                publicationComplete,
                interactionComplete,
                numberLikes[0],
                numberComments[0]
            );
            return {dto};
        }
        
    }

}
module.exports = getPublicationUseCase;
        