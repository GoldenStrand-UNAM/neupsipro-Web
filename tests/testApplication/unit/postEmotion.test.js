const postEmotionUseCase = require('../../../Back/src/application/usecase/testApplications/postEmotionUseCase');

const mockRepository = {
  fetchResultRow:    jest.fn(),
  saveEmotionResult: jest.fn(),
};

const useCase = new postEmotionUseCase(mockRepository);

const validInput = (overrides = {}) => ({
  id_user:              'u-1',
  id_application:       'app-1',
  score_anxiety_beck:   10,
  score_depression_beck: 14,
  notes:                'Sin observaciones',
  ...overrides,
});

const mockRow  = () => ({ idResults: 'r-1' });
const mockSaved = () => ({
  date_applied:          '2024-01-15',
  score_anxiety_beck:    10,
  inter_anxiety_beck:    'Leve',
  score_depression_beck: 14,
  inter_depression_beck: 'Leve',
  notes:                 'Sin observaciones',
});

describe('UNIT — postEmotionUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  // basic path

  test('1.1 returns the dto with the correct values', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue(mockSaved());

    const result = await useCase.execute(validInput());

    expect(result).toBeDefined();
    expect(result.idResults).toBe('r-1');
    expect(result.idTest).toBe(6);
    expect(result.status).toBe(3);
    expect(result.scoreAnxietyBeck).toBe(10);
    expect(result.interAnxietyBeck).toBe('Leve');
    expect(result.scoreDepressionBeck).toBe(14);
    expect(result.interDepressionBeck).toBe('Leve');
    expect(result.notes).toBe('Sin observaciones');
    expect(mockRepository.fetchResultRow).toHaveBeenCalledTimes(1);
    expect(mockRepository.saveEmotionResult).toHaveBeenCalledTimes(1);
  });

  test('1.2 maps date_applied and notes to null when the saved record doesnt have them', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({
      ...mockSaved(),
      date_applied: undefined,
      notes:        undefined,
    });

    const result = await useCase.execute(validInput({ notes: undefined }));

    expect(result.dateApplied).toBeNull();
    expect(result.notes).toBeNull();
  });

  test('1.3 passes notes null when not provided', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), notes: null });

    await useCase.execute(validInput({ notes: undefined }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ notes: null })
    );
  });


  test('2.1 resolves interpretation for minimal anxiety ', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), inter_anxiety_beck: 'Mínima', score_anxiety_beck: 3 });

    await useCase.execute(validInput({ score_anxiety_beck: 3 }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ inter_anxiety_beck: 'Mínima' })
    );
  });

  test('2.2 resolves interpretation for mild anxiety', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), inter_anxiety_beck: 'Leve', score_anxiety_beck: 10 });

    await useCase.execute(validInput({ score_anxiety_beck: 10 }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ inter_anxiety_beck: 'Leve' })
    );
  });

  test('2.3 resolves interpretation for moderate anxiety', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), inter_anxiety_beck: 'Moderada', score_anxiety_beck: 20 });

    await useCase.execute(validInput({ score_anxiety_beck: 20 }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ inter_anxiety_beck: 'Moderada' })
    );
  });

  test('2.4 resolves interpretation for severe anxiety', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), inter_anxiety_beck: 'Grave', score_anxiety_beck: 45 });

    await useCase.execute(validInput({ score_anxiety_beck: 45 }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ inter_anxiety_beck: 'Grave' })
    );
  });

  test('2.5 resolves interpretation for minimal depression', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), inter_depression_beck: 'Mínima', score_depression_beck: 8 });

    await useCase.execute(validInput({ score_depression_beck: 8 }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ inter_depression_beck: 'Mínima' })
    );
  });

  test('2.6 resolves interpretation for mild depression', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), inter_depression_beck: 'Leve', score_depression_beck: 16 });

    await useCase.execute(validInput({ score_depression_beck: 16 }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ inter_depression_beck: 'Leve' })
    );
  });

  test('2.7 resolves interpretation for moderate depression', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), inter_depression_beck: 'Moderada', score_depression_beck: 25 });

    await useCase.execute(validInput({ score_depression_beck: 25 }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ inter_depression_beck: 'Moderada' })
    );
  });

  test('2.8 resolves interpretation for severe depression', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), inter_depression_beck: 'Grave', score_depression_beck: 40 });

    await useCase.execute(validInput({ score_depression_beck: 40 }));

    expect(mockRepository.saveEmotionResult).toHaveBeenCalledWith(
      expect.objectContaining({ inter_depression_beck: 'Grave' })
    );
  });

  test('3.1 422 when score_anxiety_beck is less than 0', async () => {
    await expect(useCase.execute(validInput({ score_anxiety_beck: -1 })))
      .rejects.toMatchObject({ status: 422, message: 'score_anxiety_beck must be between 0 and 100' });
    expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
  });

  test('3.2 422 when score_anxiety_beck is greater than 100', async () => {
    await expect(useCase.execute(validInput({ score_anxiety_beck: 101 })))
      .rejects.toMatchObject({ status: 422 });
    expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
  });

  test('3.3 accepts score_anxiety_beck within the range (0 to 100)', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue(mockSaved());

    await expect(useCase.execute(validInput({ score_anxiety_beck: 0 }))).resolves.toBeDefined();
    await expect(useCase.execute(validInput({ score_anxiety_beck: 100 }))).resolves.toBeDefined();
  });


  test('4.1 throws 422 when score_depression_beck is null', async () => {
    await expect(useCase.execute(validInput({ score_depression_beck: null })))
      .rejects.toMatchObject({ status: 422 });
    expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
  });

  test('4.2 422 when score_depression_beck is less than 0', async () => {
    await expect(useCase.execute(validInput({ score_depression_beck: -1 })))
      .rejects.toMatchObject({ status: 422, message: 'score_depression_beck must be between 0 and 100' });
    expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
  });

  test('4.3 422 when score_depression_beck is greater than 100', async () => {
    await expect(useCase.execute(validInput({ score_depression_beck: 101 })))
      .rejects.toMatchObject({ status: 422 });
    expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
  });

  test('5.1 422 when notes exceeds 2000 characters', async () => {
    const notesLargas = 'a'.repeat(2001);
    await expect(useCase.execute(validInput({ notes: notesLargas })))
      .rejects.toMatchObject({ status: 422, message: 'notes must be 2000 characters or less' });
    expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
  });

  test('5.2 422 when notes has exactly 2000 characters', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue(mockSaved());

    const notesExactas = 'a'.repeat(2000);
    await expect(useCase.execute(validInput({ notes: notesExactas }))).resolves.toBeDefined();
  });

  test('5.3 422 when notes is undefined', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(mockRow());
    mockRepository.saveEmotionResult.mockResolvedValue({ ...mockSaved(), notes: null });

    await expect(useCase.execute(validInput({ notes: undefined }))).resolves.toBeDefined();
  });


  test('6.1 404 when fetchResultRow returns null', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(null);

    await expect(useCase.execute(validInput()))
      .rejects.toMatchObject({ status: 404, message: 'Test result row not found' });
    expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
  });

  test('6.2 404 when fetchResultRow returns undefined', async () => {
    mockRepository.fetchResultRow.mockResolvedValue(undefined);

    await expect(useCase.execute(validInput()))
      .rejects.toMatchObject({ status: 404 });
    expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
  });

  test('6.3 422 when notes contains emojis', async () => {
  await expect(useCase.execute(validInput({ notes: 'Paciente estable 😀' })))
    .rejects.toMatchObject({ status: 422 });
  expect(mockRepository.saveEmotionResult).not.toHaveBeenCalled();
});
});