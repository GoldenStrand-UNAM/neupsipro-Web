const ForumPostDTO = require('../../dto/forumPostDTO');

class getForumUseCase {
    constructor (forumRepository) {
        this.forumRepository = forumRepository;
    }

    async execute (params) {
        const posts = await this.forumRepository.fetchAll (params);
        return ForumPostDTO.fromArray (posts);
    }
}

module.exports = getForumUseCase;
    


module.exports = getForumUseCase;