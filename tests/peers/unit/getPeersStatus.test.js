const GetPeerStatsUseCase = require('../../../Back/src/application/usecase/peers/getPeerStatsUseCase');

describe('GetPeerStatsUseCase', () => {
  let peerSessionRepository, useCase;

  beforeEach(() => {
    peerSessionRepository = {
      fetchAllForStats: jest.fn(),
    };
    useCase = new GetPeerStatsUseCase(peerSessionRepository);
  });

  test('throw an error if fetchAllForStats fails', async () => {
    peerSessionRepository.fetchAllForStats.mockRejectedValue(new Error('Error ejecutando la consulta'));
    await expect(useCase.execute()).rejects.toThrow('Error ejecutando la consulta');
  });

    test('return empty/undefined structure if repository returns empty data', async () => {
    peerSessionRepository.fetchAllForStats.mockResolvedValue([]);

    const result = await useCase.execute({ idUser: 1 });

    expect(result).toEqual({
      "attendanceSeries": [],
      "genderSeries": [],
      "kpis": {
        "avgPerSession": 0,
        "totalAttendees": 0,
        "totalMen": 0,
        "totalSessions": 0,
        "totalWomen": 0
      }
    });
    });

    test('Happy path with one session', async () => {
      peerSessionRepository.fetchAllForStats.mockResolvedValue([{
        title: 'Test',
        session_date: '2020-01-01',
        men_count: '12',
        women_count: '10',
      }]);

      const result = await useCase.execute();

      expect(result).toEqual({
        "attendanceSeries": [{
          "date": "2020-01-01",
          "total": 22
        }],
        "genderSeries": [{
          "date": "2020-01-01",
          "men": 12,
          "title": "Test",
          "women": 10
        }],
        "kpis": {
          "avgPerSession": 22,
          "totalAttendees": 22,
          "totalMen": 12,
          "totalSessions": 1,
          "totalWomen": 10
        }
      });
    });

    test('Happy path with one session', async () => {
      peerSessionRepository.fetchAllForStats.mockResolvedValue([{
        title: 'Test',
        session_date: '2020-01-01',
        men_count: '12',
        women_count: '10',
      },
      {
        title: 'Test2',
        session_date: '2021-01-01',
        men_count: '6',
        women_count: '8',
      },
      {
        title: 'Test3',
        session_date: '2022-01-01',
        men_count: '18',
        women_count: '24',
      }
    ]);

      const result = await useCase.execute();

      expect(result).toEqual({
        "attendanceSeries": [{
          "date": "2020-01-01",
          "total": 22
        },
        {
          "date": "2021-01-01",
          "total": 14
        },
        {
          "date": "2022-01-01",
          "total": 42
        }
      ],
        "genderSeries": [{
          "date": "2020-01-01",
          "men": 12,
          "title": "Test",
          "women": 10
        },
        {
          "date": "2021-01-01",
          "men": 6,
          "title": "Test2",
          "women": 8
        },
        {
          "date": "2022-01-01",
          "men": 18,
          "title": "Test3",
          "women": 24
        }
      ],
        "kpis": {
          "avgPerSession": 26,
          "totalAttendees": 78,
          "totalMen": 36,
          "totalSessions": 3,
          "totalWomen": 42
        }
      });
    });
});