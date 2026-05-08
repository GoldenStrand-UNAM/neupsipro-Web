const db = require ('../database/database');
const InteractionRepository = require('../../domain/repository/interactionRepository');

class ImpInteractionRepository extends InteractionRepository {
  async fetchAllFromOne ({ idPublication }) {
    if (!idPublication || idPublication === '') {
      throw  new Error('Missing ID');
    }
    const result = await db.query(
      `SELECT 
                i.id_interaction,
                i.is_like,
                i.content, 
                i.date_and_time,
                u.first_name,
                u.lastname_p,
                u.lastname_m,
                u.profile_photo 
            FROM interaction i
            JOIN publication p ON p.id_publication = i.id_publication 
			JOIN users u ON u.id_user = i.id_user AND i.is_like = 0
            WHERE p.id_publication = ?`,
      [idPublication]
    );
    return result;
  }

  async fetchLikes ({ idPublication }) {
    if (!idPublication || idPublication === '') {
      throw  new Error('Missing ID');
    }
    const result = await db.query(`SELECT COUNT(*) AS likes
            FROM interaction i
            WHERE i.id_publication = '87981835-3abc-11f1-b5a8-dc2148751be6' AND i.is_like = 1;
            `, [idPublication]);
    return result[0];
  }

  async fetchComments ({ idPublication }) {
    if (!idPublication || idPublication === '') {
      throw  new Error('Missing ID');
    }
    const result = await db.query(`SELECT COUNT(*) AS comments
            FROM interaction i
            WHERE i.id_publication = '87981835-3abc-11f1-b5a8-dc2148751be6' AND i.is_like = 0;
            `, [idPublication]);
    return result[0];
  }
}
module.exports = ImpInteractionRepository;
