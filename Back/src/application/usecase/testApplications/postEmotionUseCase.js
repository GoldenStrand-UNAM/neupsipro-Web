const EmotionResultsDTO = require('../../dto/emotionResultsDTO');

class postEmotionUseCase {

  constructor (impTestResultsRepository) {
    this.impTestResultsRepository = impTestResultsRepository;
  }

  resolveAnxietyBeck (score) {
    if (score <= 5)  return 'Mínima';
    if (score <= 15) return 'Leve';
    if (score <= 30) return 'Moderada';
    return 'Grave';
  }

  resolveDepressionBeck (score) {
    if (score <= 13) return 'Mínima';
    if (score <= 19) return 'Leve';
    if (score <= 28) return 'Moderada';
    return 'Grave';
  }

  async execute ({ id_user, id_application, score_anxiety_beck, score_depression_beck, notes }) {

    // 1. Validate score_anxiety_beck
    const anxiety = Number(score_anxiety_beck);
    if (score_anxiety_beck === undefined || score_anxiety_beck === null || score_anxiety_beck === '' || isNaN(anxiety)) {
      const err = new Error('score_anxiety_beck must be a valid number');
      err.status = 422;
      throw err;
    }
    if (anxiety < 0 || anxiety > 100) {
      const err = new Error('score_anxiety_beck must be between 0 and 100');
      err.status = 422;
      throw err;
    }

    // 2. Validate score_depression_beck
    const depression = Number(score_depression_beck);
    if (score_depression_beck === undefined || score_depression_beck === null || score_depression_beck === '' || isNaN(depression)) {
      const err = new Error('score_depression_beck must be a valid number');
      err.status = 422;
      throw err;
    }
    if (depression < 0 || depression > 100) {
      const err = new Error('score_depression_beck must be between 0 and 100');
      err.status = 422;
      throw err;
    }

    // 3. Validate notes length
    if (notes && String(notes).length > 2000) {
      const err = new Error('notes must be 2000 characters or less');
      err.status = 422;
      throw err;
    }

    // 4. Verify result row exists for this application and test
    const row = await this.impTestResultsRepository.fetchResultRow({
      id_user,
      id_application,
      id_test: 6,
    });

    if (!row) {
      const err = new Error('Test result row not found');
      err.status = 404;
      throw err;
    }

    // 5. Resolve interpretations server-side — never trust the client
    const interAnxietyBeck    = this.resolveAnxietyBeck(anxiety);
    const interDepressionBeck = this.resolveDepressionBeck(depression);

    // 6. Persist into emotion_results
    const saved = await this.impTestResultsRepository.saveEmotionResult({
      id_results:            row.idResults,
      score_anxiety_beck:    anxiety,
      inter_anxiety_beck:    interAnxietyBeck,
      score_depression_beck: depression,
      inter_depression_beck: interDepressionBeck,
      notes:                 notes ?? null,
    });

    // 7. Map to DTO — never expose raw DB row across boundaries
    return new EmotionResultsDTO({
      idResults:           row.idResults,
      idTest:              6,
      status:              3,
      dateApplied:         saved.date_applied ?? null,
      scoreAnxietyBeck:    saved.score_anxiety_beck,
      interAnxietyBeck:    saved.inter_anxiety_beck,
      scoreDepressionBeck: saved.score_depression_beck,
      interDepressionBeck: saved.inter_depression_beck,
      notes:               saved.notes ?? null,
    });
  }
}

module.exports = postEmotionUseCase;
