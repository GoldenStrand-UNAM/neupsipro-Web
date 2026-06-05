const GetPeerSessionsUseCase = require('../../../Back/src/application/usecase/peers/getPeerSessionsUseCase');

describe('GetPeerSessionsUseCase', () => {
  let mockPeerSessionRepository;
  let useCase;

  beforeEach(() => {
    mockPeerSessionRepository = {
      fetchSessions: jest.fn(),
      countSessions: jest.fn(),
    };

    useCase = new GetPeerSessionsUseCase(mockPeerSessionRepository);
  });

  describe('Happy Path', () => {
    test('must call repository and return paginated sessions', async () => {
      const rows = [
        {
          id_peer_session: 'session-1',
          title: 'Sesión clínica 1',
          responsable: 'Dr. Pérez',
          note: 'Sesión de prueba',
          session_date: '2026-01-10',
          men_count: 3,
          women_count: 5,
        },
      ];

      mockPeerSessionRepository.fetchSessions.mockResolvedValue(rows);
      mockPeerSessionRepository.countSessions.mockResolvedValue(15);

      const result = await useCase.execute({
        page: 1,
        limit: 4,
        from: '2026-01-01',
        to: '2026-01-31',
      });

      expect(mockPeerSessionRepository.fetchSessions).toHaveBeenCalledTimes(1);
      expect(mockPeerSessionRepository.fetchSessions).toHaveBeenCalledWith({
        page: 1,
        limit: 4,
        from: '2026-01-01',
        to: '2026-01-31',
      });

      expect(mockPeerSessionRepository.countSessions).toHaveBeenCalledTimes(1);
      expect(mockPeerSessionRepository.countSessions).toHaveBeenCalledWith({
        from: '2026-01-01',
        to: '2026-01-31',
      });

      expect(result).toEqual({
        sessions: [
          {
            id: 'session-1',
            title: 'Sesión clínica 1',
            responsable: 'Dr. Pérez',
            note: 'Sesión de prueba',
            date: '2026-01-10',
            menCount: 3,
            womenCount: 5,
            total: 8,
          },
        ],
        page: 1,
        totalPages: 4,
        total: 15,
      });
    });

    test('must use default page 1 and limit 4', async () => {
      mockPeerSessionRepository.fetchSessions.mockResolvedValue([]);
      mockPeerSessionRepository.countSessions.mockResolvedValue(0);

      const result = await useCase.execute({});

      expect(mockPeerSessionRepository.fetchSessions).toHaveBeenCalledWith({
        page: 1,
        limit: 4,
        from: null,
        to: null,
      });

      expect(mockPeerSessionRepository.countSessions).toHaveBeenCalledWith({
        from: null,
        to: null,
      });

      expect(result).toEqual({
        sessions: [],
        page: 1,
        totalPages: 0,
        total: 0,
      });
    });
  });

  describe('Edge Cases', () => {
    test('must convert invalid page and limit to safe defaults', async () => {
      mockPeerSessionRepository.fetchSessions.mockResolvedValue([]);
      mockPeerSessionRepository.countSessions.mockResolvedValue(0);

      const result = await useCase.execute({
        page: 0,
        limit: 0,
      });

      expect(mockPeerSessionRepository.fetchSessions).toHaveBeenCalledWith({
        page: 1,
        limit: 4,
        from: null,
        to: null,
      });

      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(0);
    });

    test('must return empty sessions if repository returns empty rows', async () => {
      mockPeerSessionRepository.fetchSessions.mockResolvedValue([]);
      mockPeerSessionRepository.countSessions.mockResolvedValue(0);

      const result = await useCase.execute({
        page: 1,
        limit: 4,
      });

      expect(result.sessions).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    test('must calculate totalPages using ceil', async () => {
      mockPeerSessionRepository.fetchSessions.mockResolvedValue([]);
      mockPeerSessionRepository.countSessions.mockResolvedValue(9);

      const result = await useCase.execute({
        page: 1,
        limit: 4,
      });

      expect(result.totalPages).toBe(3);
      expect(result.total).toBe(9);
    });
  });

  describe('Error Case', () => {
    test('must spread error if repository fails', async () => {
      const databaseError = new Error('Conexión perdida con la BD');

      mockPeerSessionRepository.fetchSessions.mockRejectedValue(databaseError);
      mockPeerSessionRepository.countSessions.mockResolvedValue(0);

      await expect(
        useCase.execute({
          page: 1,
          limit: 4,
        })
      ).rejects.toThrow('Conexión perdida con la BD');

      expect(mockPeerSessionRepository.fetchSessions).toHaveBeenCalledTimes(1);
    });
  });
});