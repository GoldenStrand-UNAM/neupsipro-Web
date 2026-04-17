const ForumPostDTO = require('../../dto/forumPostDTO');
const { getPresignedUrl } = require('../../../infrastructure/external/s3.config');


class getForumUseCase {
    constructor (forumRepository) {
        this.forumRepository = forumRepository;
    }

    async execute (params) {
        const posts = await this.forumRepository.fetchAll (params);
        const dtos = ForumPostDTO.fromArray(posts);

        return Promise.all(dtos.map(async dto => ({
            ...dto,
            image: await getPresignedUrl(dto.image),
            pp: await getPresignedUrl(dto.pp),
        })));

    }
}

module.exports = getForumUseCase;
    