module.exports = class getPublicationUseCase {
    constructor (repository) {
        this.forumRepository = repository;
    }
    async execute (idPublication) {
        if(!idPublication || idPublication == '') {
            throw  new Error("Missing ID");
        }
        const publication = await this.forumRepository.getInteractions(idPublication);
        console.log(publication);
        return publication;
    }
};
