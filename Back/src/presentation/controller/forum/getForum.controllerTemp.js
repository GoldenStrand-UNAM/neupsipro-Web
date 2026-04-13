const GetForumUseCase = require("../../../application/usecase/getForumUseCase");


// Controller function that handles HTTP request to get forum posts
class ForumController {
    constructor (getForumUseCase) {
        this.getForumUseCase = getForumUseCase;
    }

    async getForum (request, response) {
        try {
            const { page = 1, limit = 10 } = request.query;
            const posts = await this.getForumUseCase.execute({ page, limit });


            response.render('Forum/forum', { posts });

            
        } catch (error) {
            response.status(500).json({ error: error.message });
        }
    }
}

module.exports = ForumController;

