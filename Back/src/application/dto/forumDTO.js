class ForumDTO {
  constructor({ posts, page, limit, total }) {
    this.posts = posts;
    this.pagination = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = ForumDTO;
