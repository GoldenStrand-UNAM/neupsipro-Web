const ForumPostDTO = require('../../dto/forumPostDTO');
const { getPresignedUrl } = require('../../../infrastructure/external/s3.config');

// Use case to get forum posts
class getForumUseCase {
    constructor (forumRepository) {

        // Inject repository (data access layer)
        this.forumRepository = forumRepository;
    }

    async execute (params) {
        // Fetch posts and total count in parallel
        const [posts, total] = await Promise.all([
        this.forumRepository.fetchAll (params),
        this.forumRepository.count (),
        ]);

        // Convert raw data to DTOs
        const dtos = ForumPostDTO.fromArray (posts);

        const resolved = await Promise.all(dtos.map(async dto => ({
        ...dto,
        image: await getPresignedUrl(dto.image),
        pp: await getPresignedUrl(dto.pp),
        })));

        // Return formatted posts and total count
        return { posts: resolved, total };

    }
}

module.exports = getForumUseCase;
    