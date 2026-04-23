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

        const interactionComplete = await Promise.all (interactionComments[0].map(async interaction => ({
            ...interaction,
            interactionUPhoto: await getPresignedUrl(interaction.profile_photo),
            })));

        const dto = new postInteractionDTO (publication[0], interactionComplete,numberLikes[0], numberComments[0]);
        
        console.log(dto);

        const publicationPhotos = await Promise.all (publication[0].map(async publi => ({
                publicationUserPhoto: await getPresignedUrl(publi.profile_photo),
                publicationImage: await getPresignedUrl(publi.image),
            })));



        return {dto, publicationPhotos};
    }

}
module.exports = getPublicationUseCase;
        
