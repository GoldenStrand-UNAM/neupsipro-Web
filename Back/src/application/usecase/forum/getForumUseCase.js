// Forum use case that retrieves and formats forum posts
class getForumUseCase {
    constructor (forumRepository) {
        this.forumRepository = forumRepository;
    }

    async execute (params) {

        const post = await this.forumRepository.fetchAll(params);

        //Map data that we recieve from forumrepository into clean data for the client
        return post.map((p) => ({
            id: p.id_publication,
            title: p.title,
            content: p.content,
            image: p.image,
            date: p.time_and_date,
            author: p.full_name,
            pp: p.profile_photo,
        }));
    }
}
    


module.exports = getForumUseCase;