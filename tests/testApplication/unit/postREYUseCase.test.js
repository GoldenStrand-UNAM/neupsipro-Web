const postREYUseCase = require(
  '../../../Back/src/application/usecase/testApplications/postReyUseCase'
);

describe('postREYUseCase', () => {

  let resultsRepository;
  let useCase;

  const validInput = {
    id_user: 'user-001',
    id_application: 'app-001',
    score_rc: 30,
    time_rc: 60,
    score_mcp: 18,
    time_mcp: 60,
    score_mlp: 17,
    time_mlp: 60,
    notes: 'Memoria visual conservada',
  };

  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2026-05-19T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {

    resultsRepository = {
      fetchResultRow: jest.fn(),
      fetchUserSchooling: jest.fn(),
      fetchUserAge: jest.fn(),
      saveREYResult: jest.fn(),
    };

    useCase = new postREYUseCase(resultsRepository);

    resultsRepository.fetchResultRow.mockResolvedValue({
      idResults: 'r-001',
      status: 1,
    });

    resultsRepository.fetchUserSchooling
      .mockResolvedValue('Licenciatura');

    resultsRepository.fetchUserAge
      .mockResolvedValue('1996-01-15');

    resultsRepository.saveREYResult.mockResolvedValue({
      id_results: 'r-001',

      score_rc: 30,
      pc_rc: 50,
      time_rc: 60,
      pc_time_rc: 50,

      score_mcp: 18,
      pc_mcp: 45,
      time_mcp: 60,
      pc_time_mcp: 50,

      score_mlp: 17,
      pc_mlp: 40,
      time_mlp: 60,
      pc_time_mlp: 50,

      notes: 'ok',
      date_applied: '2026-05-19',
    });

  });

  test.each([
    ['score_rc', -1],
    ['time_rc', -1],
    ['score_mcp', -1],
    ['time_mcp', -1],
    ['score_mlp', -1],
    ['time_mlp', -1],
  ])('throws 422 if %s is negative', async (field, value) => {

    await expect(
      useCase.execute({
        ...validInput,
        [field]: value,
      })
    ).rejects.toMatchObject({
      status: 422,
    });

  });

  test('throws 422 if notes exceed 200 chars', async () => {

    await expect(
      useCase.execute({
        ...validInput,
        notes: 'a'.repeat(201),
      })
    ).rejects.toMatchObject({
      status: 422,
    });

  });

  test('throws 404 if result row is not found', async () => {

    resultsRepository.fetchResultRow
      .mockResolvedValue(null);

    await expect(
      useCase.execute(validInput)
    ).rejects.toMatchObject({
      status: 404,
    });

    expect(
      resultsRepository.fetchUserSchooling
    ).not.toHaveBeenCalled();

  });

  test('throws 422 if schooling data is missing', async () => {

    resultsRepository.fetchUserSchooling
      .mockResolvedValue(null);

    await expect(
      useCase.execute(validInput)
    ).rejects.toMatchObject({
      status: 422,
    });

  });

  test('throws 422 if age data is missing', async () => {

    resultsRepository.fetchUserAge
      .mockResolvedValue(null);

    await expect(
      useCase.execute(validInput)
    ).rejects.toMatchObject({
      status: 422,
    });

  });

  test('accepts numeric strings', async () => {

    await useCase.execute({
      ...validInput,
      score_rc: '30',
    });

    expect(
      resultsRepository.saveREYResult
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        score_rc: 30,
      })
    );

  });

  test('persists result and returns DTO', async () => {

    const result =
      await useCase.execute(validInput);

    expect(
      resultsRepository.saveREYResult
    ).toHaveBeenCalledWith(
      expect.objectContaining({

        id_results: 'r-001',

        score_rc: 30,
        time_rc: 60,

        score_mcp: 18,
        time_mcp: 60,

        score_mlp: 17,
        time_mlp: 60,

        notes: 'Memoria visual conservada',

        pc_rc: expect.any(Number),
        pc_time_rc: expect.any(Number),

      })
    );

    expect(result.idResults)
      .toBe('r-001');

    expect(result.idTest)
      .toBe(3);

    expect(result.status)
      .toBe(3);

    expect(result.rc.score)
      .toBe(30);

  });

  test('stores notes as null when omitted', async () => {

    await useCase.execute({
      ...validInput,
      notes: undefined,
    });

    expect(
      resultsRepository.saveREYResult
        .mock.calls[0][0]
        .notes
    ).toBeNull();

  });

  test('propagates repository errors', async () => {

    resultsRepository.fetchResultRow
      .mockRejectedValue(
        new Error('DB error')
      );

    await expect(
      useCase.execute(validInput)
    ).rejects.toThrow('DB error');

  });

});