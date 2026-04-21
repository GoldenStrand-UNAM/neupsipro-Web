const ForumPostDTO = require('../../dto/forumPostDTO');
const { getPresignedUrl } = require('../../../infrastructure/external/s3.config');


class getForumUseCase {
    constructor (forumRepository) {
        this.forumRepository = forumRepository;
    }

    async execute (params) {
        const [posts, total] = await Promise.all([
        this.forumRepository.fetchAll (params),
        this.forumRepository.count (),
        ]);

        const dtos = ForumPostDTO.fromArray (posts);
        const resolved = await Promise.all(dtos.map(async dto => ({
        ...dto,
        image: await getPresignedUrl(dto.image),
        pp: await getPresignedUrl(dto.pp),
        })));

        return { posts: resolved, total };

    }
}

module.exports = getForumUseCase;
    