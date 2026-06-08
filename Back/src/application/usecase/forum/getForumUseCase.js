const ForumPostDTO = require('../../dto/forumPostDTO');
const ForumDTO = require('../../dto/forumDTO');
const { getPresignedUrl } = require('../../../infrastructure/external/s3.config');

class GetForumUseCase {
  constructor(forumRepository) {
    this.forumRepository = forumRepository;
  }

  async execute({ page = 1, limit = 10 }) {
    const [posts, total] = await Promise.all([
      this.forumRepository.fetchAll({ page, limit }),
      this.forumRepository.count(),
    ]);

    const postDtos = ForumPostDTO.fromArray(posts);

    const resolvedPosts = await Promise.all(
      postDtos.map(async post => ({
        ...post,
        image: await getPresignedUrl(post.image),
        pp: await getPresignedUrl(post.pp),
      }))
    );

    return new ForumDTO({
      posts: resolvedPosts,
      page,
      limit,
      total,
    });
  }
}

<<<<<<< HEAD
module.exports = GetForumUseCase;
=======
module.exports = GetForumUseCase;
>>>>>>> 9f392ba005e2d865cd4a75f77eaaf0d9747ff1a7
