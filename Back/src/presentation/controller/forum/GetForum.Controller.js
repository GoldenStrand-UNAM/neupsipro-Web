
// Controller function that handles HTTP request to get forum posts
class forumController {
    constructor (getForumUseCase) {
        this.getForumUseCase = getForumUseCase;
        }

    async getForum (request, response) {
        try {

            let { page = 1, limit = 10 } = request.query;
            page  = Math.max(1, parseInt(page)  || 1);
            limit = Math.min(50, Math.max(1, parseInt(limit) || 10));

            const { posts, total } = await this.getForumUseCase.execute({ page, limit });
            const totalPages = Math.ceil(total / limit);


        response.render ('Forum/forum', {
            activePage: 'foro',
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

