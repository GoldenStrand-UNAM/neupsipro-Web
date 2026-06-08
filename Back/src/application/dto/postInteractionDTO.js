const Crypt = require('../../infrastructure/crypt/forum/uncryptUsername');

const crypt = new Crypt();

class postInteractionDTO {
  constructor (exists, rawPosts, interactions, numberLikes, numberComments) {
    this.success = exists;
    const posts = rawPosts.map (post => crypt.uncryptDetailUsername(post));
    this.publication = posts.map (post => ({
      id: post.id_publication,
      title: post.title,
      content: post.content,
      image: post.postPhoto,
      date: post.time_and_date,
      firstName: post.first_name,
      lastNameP: post.lastname_p,
      lastNameM: post.lastname_m,
      pp: post.userPhoto,
    }));
    this.interactionList = interactions.map (interaction => ({
      idIinteraction: interaction.id_interaction,
      idPublication: interaction.id_publication,
      isLike: interaction.is_like,
      content: interaction.content,
      dateAndTime: interaction.date_and_time,
      firstName: interaction.first_name,
      lastNameP: interaction.lastname_p,
      lastNameM: interaction.lastname_m,
      pp: interaction.interactionUPhoto,
    }));
    this.likes = numberLikes.likes,
    this.comments = numberComments.comments;
  }
}

module.exports = postInteractionDTO;
