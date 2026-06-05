const GetPeerSessionsController = require('../../../Back/src/presentation/controller/peerSession/getPeerSession.controller');

describe('GetPeerSessionsController', () => {
  let mockUseCase;
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn(),
    };

    controller = new GetPeerSessionsController(mockUseCase);

    mockReq = {
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy Path', () => {
    test('must return 200 & peer sessions data', async () => {
      mockReq.query = {
        page: '1',
        limit: '4',
        from: '2026-01-01',
        to: '2026-01-31',
      };

      const result = {
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
        totalPages: 1,
        total: 1,
      };

      mockUseCase.execute.mockResolvedValue(result);

      await controller.getPeerSessions(mockReq, mockRes);

      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: '1',
        limit: '4',
        from: '2026-01-01',
        to: '2026-01-31',
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: result,
      });
    });

    test('must pass undefined query params to use case when no query is sent', async () => {
      const result = {
        sessions: [],
        page: 1,
        totalPages: 0,
        total: 0,
      };

      mockUseCase.execute.mockResolvedValue(result);

      await controller.getPeerSessions(mockReq, mockRes);

      expect(mockUseCase.execute).toHaveBeenCalledWith({
        page: undefined,
        limit: undefined,
        from: undefined,
        to: undefined,
      });

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: result,
      });
    });
  });

  describe('Error Cases', () => {
    test('must return 409 if use case throws database error', async () => {
      const error = new Error('Database error');
      error.code = 'ER_BAD_FIELD_ERROR';

      mockUseCase.execute.mockRejectedValue(error);

      await controller.getPeerSessions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error al consultar el historial.',
      });
    });

    test('must return 400 if use case throws regular error', async () => {
      mockUseCase.execute.mockRejectedValue(new Error('Invalid date range'));

      await controller.getPeerSessions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Invalid date range',
      });
    });
  });
});