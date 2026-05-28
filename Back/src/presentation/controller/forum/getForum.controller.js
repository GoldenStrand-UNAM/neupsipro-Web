const logger = require('../../../infrastructure/external/logger.service');

// Controller function that handles HTTP request to get forum posts
class forumController {
  constructor (getForumUseCase, authUseCase) {
    this.getForumUseCase = getForumUseCase;
    this.authUseCase = authUseCase;
  }

  async getForum (request, response) {
    const userId = request.user?.userId ?? request.user?.id;
    logger.debug('getForum: inicio', { userId, query: request.query });
    try {
      let { page = 1, limit = 10 } = request.query;

      page  = Math.max (1, parseInt(page)  || 1);
      limit = Math.min (20, Math.max(1, parseInt(limit) || 10));

      const { posts, total } = await this.getForumUseCase.execute({ page, limit });
      const totalPages = Math.ceil(total / limit);

      let canEliminate = false;
      if (userId) {
        try {
          canEliminate = await this.authUseCase.checkPermission(userId, 'Forum', 'eliminate');
        } catch {
          canEliminate = false;
        }
      }

      logger.info('getForum: éxito', { userId, page, limit, total });
      response.render ('forum/forum', {
        activePage: 'forum',   tutorialModule: 'forum',
        posts,
        page,
        limit,
        totalPages,
        canEliminate,
      });

    } catch (error) {
      logger.error('getForum: error', { error, userId });
      response.status(500).json({ error: error.message });
    }
  }

}

module.exports = forumController;
