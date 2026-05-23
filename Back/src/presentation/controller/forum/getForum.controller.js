
// Controller function that handles HTTP request to get forum posts
class forumController {
  constructor (getForumUseCase) {

    // Inject use case (business logic)
    this.getForumUseCase = getForumUseCase;
  }

  // Method to get forum posts
  async getForum (request, response) {
    try {

      // Get pagination params from query (default: page=1, limit=10)
      let { page = 1, limit = 10 } = request.query;

      // Ensure page is at least 1
      page  = Math.max (1, parseInt(page)  || 1);

      // Ensure limit is between 1 and 20
      limit = Math.min (20, Math.max(1, parseInt(limit) || 10));

      // Call use case to get posts and total count
      const { posts, total } = await this.getForumUseCase.execute({ page, limit });

      // Calculate total number of pages
      const totalPages = Math.ceil(total / limit);

      // Render forum view with data
      response.render ('Forum/forum', {
        activePage: 'forum',
        posts,
        page,
        limit,
        totalPages,

      });

    } catch (error) {
      response.status(500).json({ error: error.message });
    }
  }

}

module.exports = forumController;
