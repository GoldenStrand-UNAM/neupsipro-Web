class ForumPostDTO {
    constructor(post) {
        this.id      = post.id_publication;
        this.title   = post.title;
        this.content = post.content;
        this.image   = post.image;
        this.date    = post.time_and_date;
        this.author  = post.full_name;
        this.pp      = post.profile_photo;
    }

    // Utility to map an array of raw posts
    static fromArray(posts) {
        return posts.map(p => new ForumPostDTO(p));
    }
}

module.exports = ForumPostDTO;