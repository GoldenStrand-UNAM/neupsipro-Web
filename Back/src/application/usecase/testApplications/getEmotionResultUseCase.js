const EmotionResultsDTO = require('../../dto/emotionResultsDTO');

class getEmotionResultUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  async execute ({ id_results }) {

    const row = await this.impTestResultsRepository.fetchEmotionResult({ id_results });

    if (!row) {
      const err = new Error('Emotion result not found');
      err.status = 404;
      throw err;
    }

    return new EmotionResultsDTO({
      idResults:           row.id_results,
      idTest:              6,
      status:              row.status,
      dateApplied:         row.date_applied ?? null,
      scoreAnxietyBeck:    row.score_anxiety_beck,
      interAnxietyBeck:    row.inter_anxiety_beck,
      scoreDepressionBeck: row.score_depression_beck,
      interDepressionBeck: row.inter_depression_beck,
      notes:               row.notes ?? null,
    });
  }
}

module.exports = getEmotionResultUseCase;
