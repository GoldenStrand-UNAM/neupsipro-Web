const getEmotionResultUseCase = require('../../../Back/src/application/usecase/testApplications/getEmotionResultUseCase');

const mockRepository = {
  fetchEmotionResult: jest.fn(),
};

const useCase = new getEmotionResultUseCase(mockRepository);

describe('UNIT — getEmotionResultUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  test('1.1 returns an EmotionResultsDTO when the result exists', async () => {
    mockRepository.fetchEmotionResult.mockResolvedValue({
      id_results:            'r-1',
      status:                'completed',
      date_applied:          '2024-01-15',
      score_anxiety_beck:    10,
      inter_anxiety_beck:    'Leve',
      score_depression_beck: 14,
      inter_depression_beck: 'Leve',
      notes:                 'Sin observaciones',
    });

    const result = await useCase.execute({ id_results: 'r-1' });

    expect(result).toBeDefined();
    expect(result.idResults).toBe('r-1');
    expect(result.idTest).toBe(6);
    expect(result.status).toBe('completed');
    expect(result.dateApplied).toBe('2024-01-15');
    expect(result.scoreAnxietyBeck).toBe(10);
    expect(result.interAnxietyBeck).toBe('Leve');
    expect(result.scoreDepressionBeck).toBe(14);
    expect(result.interDepressionBeck).toBe('Leve');
    expect(result.notes).toBe('Sin observaciones');
    expect(mockRepository.fetchEmotionResult).toHaveBeenCalledTimes(1);
    expect(mockRepository.fetchEmotionResult).toHaveBeenCalledWith({ id_results: 'r-1' });
  });

  test('1.2 maps date_applied and notes to null when they are not present in the row', async () => {
    mockRepository.fetchEmotionResult.mockResolvedValue({
      id_results:            'r-2',
      status:                'pending',
      date_applied:          undefined,
      score_anxiety_beck:    0,
      inter_anxiety_beck:    'Mínimo',
      score_depression_beck: 0,
      inter_depression_beck: 'Mínimo',
      notes:                 undefined,
    });

    const result = await useCase.execute({ id_results: 'r-2' });

    expect(result.dateApplied).toBeNull();
    expect(result.notes).toBeNull();
  });

  test('1.3 always assigns idTest = 6 regardless of the row data', async () => {
    mockRepository.fetchEmotionResult.mockResolvedValue({
      id_results:            'r-3',
      status:                'completed',
      score_anxiety_beck:    5,
      inter_anxiety_beck:    'Mínimo',
      score_depression_beck: 5,
      inter_depression_beck: 'Mínimo',
    });

    const result = await useCase.execute({ id_results: 'r-3' });

    expect(result.idTest).toBe(6);
  });

  test('2.1 throws a 404 error when the repository returns null', async () => {
    mockRepository.fetchEmotionResult.mockResolvedValue(null);

    await expect(useCase.execute({ id_results: 'no-existe' }))
      .rejects.toMatchObject({ message: 'Emotion result not found', status: 404 });

    expect(mockRepository.fetchEmotionResult).toHaveBeenCalledTimes(1);
  });

  test('2.2 throws a 404 error when the repository returns undefined', async () => {
    mockRepository.fetchEmotionResult.mockResolvedValue(undefined);

    const error = await useCase.execute({ id_results: 'r-99' }).catch(e => e);

    expect(error).toBeDefined();
    expect(error.status).toBe(404);
    expect(error.message).toBe('Emotion result not found');
  });

  test('3.1 propagates the error when the repository throws an exception', async () => {
    mockRepository.fetchEmotionResult.mockRejectedValue(new Error('DB connection failed'));

    await expect(useCase.execute({ id_results: 'r-1' }))
      .rejects.toThrow('DB connection failed');
  });

  test('4.1 calls the repository with the provided id_results', async () => {
    mockRepository.fetchEmotionResult.mockResolvedValue({
      id_results:            'abc-123',
      status:                'completed',
      score_anxiety_beck:    20,
      inter_anxiety_beck:    'Moderado',
      score_depression_beck: 22,
      inter_depression_beck: 'Moderado',
    });

    await useCase.execute({ id_results: 'abc-123' });

    expect(mockRepository.fetchEmotionResult).toHaveBeenCalledWith({ id_results: 'abc-123' });
  });
});