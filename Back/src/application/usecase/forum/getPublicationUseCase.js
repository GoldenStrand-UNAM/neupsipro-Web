const { getPresignedUrl } = require("../../../infrastructure/external/s3.config");
const postInteractionDTO = require("../../dto/postInteractionDTO");

class getPublicationUseCase {
    constructor (forumRepository, interactionRepository, userRepository) {
        this.forumRepository = forumRepository;
        this.interactionRepository = interactionRepository;
        this.userRepository = userRepository

    }

    // Execute method for this use case that returns a post interaction DTO.
    async execute ({idPublication}) {

        // It gets a publication with the necessary user information.
        const publication = await this.forumRepository.fetchOneUser({idPublication});
        // Gets an array of comments with the necessary user information of each one. 
        const interactionComments = await this.interactionRepository.fetchAllFromOne({idPublication});

        // Gets the number of likes the publication has. 
        const numberLikes = await this.interactionRepository.fetchLikes({idPublication});

        // Gets the number of comments the publication has
        const numberComments = await this.interactionRepository.fetchComments({idPublication});

        // In charge of getting the correct URL for the publication photo and its user. 
        const publicationComplete = await Promise.all (publication[0].map(async publi => ({
            ...publi,
            userPhoto: await getPresignedUrl(publi.profile_photo),
            postPhoto: await getPresignedUrl(publi.image),
            })));

        
        // In charge of getting the correct URL for each of the users photos of the comments.
        const interactionComplete = await Promise.all (interactionComments[0].map(async interaction => ({
            ...interaction,
            interactionUPhoto: await getPresignedUrl(interaction.profile_photo),
            })));
        // Checks that the publication exists.
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
        