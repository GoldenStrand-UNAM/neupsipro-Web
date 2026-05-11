const getDashboardUnitUseCase = require('../../../Back/src/application/usecase/dashboard/getDashboardUnitUseCase');

describe('getDashboardUnitUseCase', () => {
    let dashboardRepository, useCase;

    beforeEach (() => {
        dashboardRepository = { fetchCounts: jest.fn(), fetchAgeDistribution: jest.fn(), fetchGenderDistribution: jest.fn(), fetchTestCounts: jest.fn(), fetchStandByList: jest.fn() };
        useCase = new getDashboardUnitUseCase(dashboardRepository);
    });

    test('throw an error if all fetches fail', async () => {
        dashboardRepository.fetchCounts.mockRejectedValue(new Error('Error ejecutando la consulta'));
        dashboardRepository.fetchAgeDistribution.mockRejectedValue(new Error('Error ejecutando la consulta'));
        dashboardRepository.fetchGenderDistribution.mockRejectedValue(new Error('Error ejecutando la consulta'));
        dashboardRepository.fetchTestCounts.mockRejectedValue(new Error('Error ejecutando la consulta'));
        dashboardRepository.fetchStandByList.mockRejectedValue(new Error('Error ejecutando la consulta'));
        await expect(useCase.execute()).rejects.toThrow('Error ejecutando la consulta');
    });

    test('throw error if fetchCounts fails', async () => {
        dashboardRepository.fetchCounts.mockRejectedValue(new Error('Error obteniendo conteos'));
        dashboardRepository.fetchAgeDistribution.mockResolvedValue([]);
        dashboardRepository.fetchGenderDistribution.mockResolvedValue([]);
        dashboardRepository.fetchTestCounts.mockResolvedValue([]);
        dashboardRepository.fetchStandByList.mockResolvedValue([]);
        await expect(useCase.execute()).rejects.toThrow('Error obteniendo conteos');
    });

        test('throw error if fetchAgeDistribution fails', async () => {
        dashboardRepository.fetchAgeDistribution.mockRejectedValue(new Error('Error obteniendo distribución por edades'));
        dashboardRepository.fetchCounts.mockResolvedValue({});
        dashboardRepository.fetchGenderDistribution.mockResolvedValue([]);
        dashboardRepository.fetchTestCounts.mockResolvedValue([]);
        dashboardRepository.fetchStandByList.mockResolvedValue([]);
        await expect(useCase.execute()).rejects.toThrow('Error obteniendo distribución por edades');
    });

    test('throw error if fetchGenderDistribution fails', async () => {
        dashboardRepository.fetchGenderDistribution.mockRejectedValue(new Error('Error obteniendo distribución por género'));
        dashboardRepository.fetchCounts.mockResolvedValue({});
        dashboardRepository.fetchAgeDistribution.mockResolvedValue([]);
        dashboardRepository.fetchTestCounts.mockResolvedValue([]);
        dashboardRepository.fetchStandByList.mockResolvedValue([]);
        await expect(useCase.execute()).rejects.toThrow('Error obteniendo distribución por género');
    });

    test('throw error if fetchTestCounts fails', async () => {
        dashboardRepository.fetchTestCounts.mockRejectedValue(new Error('Error obteniendo pruebas'));
        dashboardRepository.fetchCounts.mockResolvedValue({});
        dashboardRepository.fetchAgeDistribution.mockResolvedValue([]);
        dashboardRepository.fetchGenderDistribution.mockResolvedValue([]);
        dashboardRepository.fetchStandByList.mockResolvedValue([]);
        await expect(useCase.execute()).rejects.toThrow('Error obteniendo pruebas');
    });

    test('throw error if fetchStandByList fails', async () => {
        dashboardRepository.fetchStandByList.mockRejectedValue(new Error('Error obteniendo lista'));
        dashboardRepository.fetchCounts.mockResolvedValue({});
        dashboardRepository.fetchAgeDistribution.mockResolvedValue([]);
        dashboardRepository.fetchGenderDistribution.mockResolvedValue([]);
        dashboardRepository.fetchTestCounts.mockResolvedValue([]);
        await expect(useCase.execute()).rejects.toThrow('Error obteniendo lista');
    });
    
    test('return empty structures if there is no data', async () => {
        dashboardRepository.fetchCounts.mockResolvedValue({});
        dashboardRepository.fetchAgeDistribution.mockResolvedValue([]);
        dashboardRepository.fetchGenderDistribution.mockResolvedValue([]);
        dashboardRepository.fetchTestCounts.mockResolvedValue([]);
        dashboardRepository.fetchStandByList.mockResolvedValue([]);
        const result = await useCase.execute();
        expect(result).toEqual({
        ageDistribution: { data: [], labels: [] },
        counts: {
            clinical: undefined,
            discharged: undefined,
            inIntervention: undefined,
            noProtocol: undefined,
            research: undefined,
            standBy: undefined
        },
        genderDistribution: { items: [] },
        standByList: [],
        testCounts: { items: [], totalProtocols: 0 }
        });
    });

    test('Happy path', async () => {
    const fakeCounts = {
        discharged: 4, inIntervention: 3, standBy: 4, 
        clinical: 0, research: 1, noProtocol: 0
    };

    const fakeAge = [
        { range: '18-29', total: 3 },
        { range: '30-44', total: 5 }
    ];

    const fakeGender = [
        { gender: 'Woman', total: 5 }
    ];

    const fakeTests = [
        { idTest: 1, testName: 'BANFE', total: 3 }
    ];

    const fakeStandBy = ['F-001', 'F-004'];

    dashboardRepository.fetchCounts.mockResolvedValue(fakeCounts);
    dashboardRepository.fetchAgeDistribution.mockResolvedValue(fakeAge);
    dashboardRepository.fetchGenderDistribution.mockResolvedValue(fakeGender);
    dashboardRepository.fetchTestCounts.mockResolvedValue(fakeTests);
    dashboardRepository.fetchStandByList.mockResolvedValue(fakeStandBy);

    const result = await useCase.execute();

    expect(result).toEqual({
        counts: {
            clinical: 0,
            discharged: 4,
            inIntervention: 3,
            noProtocol: 0,
            research: 1,
            standBy: 4
        },
        ageDistribution: {
            data: [3, 5],
            labels: ["18-29", "30-44"]
        },
        genderDistribution: {
            items: [
                { gender: "Woman", percentage: 100, total: 5 }
            ]
        },
        testCounts: {
            items: [
                { idTest: 1, testName: "BANFE", total: 3 }
            ],
            totalProtocols: 3
        },
        standByList: ["F-001", "F-004"]
    });
  });
})