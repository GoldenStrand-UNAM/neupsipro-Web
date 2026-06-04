class GetForumController {
  constructor(getForumUseCase) {
    this.useCase = getForumUseCase;
  }

  async getForum(req, res) {
    try {
      let { page = 1, limit = 10 } = req.query;

      page = Math.max(1, parseInt(page, 10) || 1);
      limit = Math.min(20, Math.max(1, parseInt(limit, 10) || 10));

      const dto = await this.useCase.execute({ page, limit });

      return res.status(200).json({
        data: dto,
      });
    } catch (err) {
      if (err.status && err.message) {
        return res.status(err.status).json({
          error: err.message,
        });
      }

      console.error('[GetForumController]', err);

      return res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
}

module.exports = GetForumController;