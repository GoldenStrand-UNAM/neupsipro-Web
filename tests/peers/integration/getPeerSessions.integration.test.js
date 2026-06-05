const request = require('supertest');
const app = require('../../../Back/src/app');
const db = require('../../../Back/src/infrastructure/database/database');

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      req.user = { id: 1, role: 'admin' };
      next();
    },
  }));
});

jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    requirePermission: () => (req, res, next) => next(),
  }));
});

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter:       (req, res, next) => next(),
  generalLimiter:     (req, res, next) => next(),
  apiLimiter:         (req, res, next) => next(),
  publicationLimiter: (req, res, next) => next(),
  userLimiter:        (req, res, next) => next(),
}));

jest.mock('../../../Back/src/infrastructure/database/database', () => ({
  query: jest.fn(),
}));

describe('GET /peer-sessions/list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Happy Path', () => {
    test('must return 200 & peer sessions history with pagination', async () => {
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

      db.query
        .mockResolvedValueOnce([rows])
        .mockResolvedValueOnce([[{ total: 1 }]]);

      const res = await request(app)
        .get('/peer-sessions/list?page=1&limit=4&from=2026-01-01&to=2026-01-31');

      expect(res.status).toBe(200);

      expect(res.body).toEqual({
        data: {
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
        },
      });

      expect(db.query).toHaveBeenCalledTimes(2);

      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('FROM peer_session'),
        ['2026-01-01', '2026-01-01', '2026-01-31', '2026-01-31', 4, 0]
      );

      expect(db.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining('COUNT(*) AS total'),
        ['2026-01-01', '2026-01-01', '2026-01-31', '2026-01-31']
      );
    });

    test('must return 200 & empty sessions if there are no records', async () => {
      db.query
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total: 0 }]]);

      const res = await request(app)
        .get('/peer-sessions/list?page=1&limit=4');

      expect(res.status).toBe(200);

      expect(res.body).toEqual({
        data: {
          sessions: [],
          page: 1,
          totalPages: 0,
          total: 0,
        },
      });

      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    test('must use safe page and limit when invalid values are received', async () => {
      db.query
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total: 0 }]]);

      const res = await request(app)
        .get('/peer-sessions/list?page=0&limit=0');

      expect(res.status).toBe(200);

      expect(res.body.data.page).toBe(1);
      expect(res.body.data.totalPages).toBe(0);

      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('FROM peer_session'),
        [null, null, null, null, 4, 0]
      );
    });

    test('must calculate offset correctly for page 2', async () => {
      db.query
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([[{ total: 10 }]]);

      const res = await request(app)
        .get('/peer-sessions/list?page=2&limit=4');

      expect(res.status).toBe(200);
      expect(res.body.data.page).toBe(2);
      expect(res.body.data.totalPages).toBe(3);

      expect(db.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining('LIMIT ? OFFSET ?'),
        [null, null, null, null, 4, 4]
      );
    });
  });

  describe('Error Case', () => {
    test('must return 409 if database fails with db error code', async () => {
      const dbError = new Error('Database error');
      dbError.code = 'ER_BAD_FIELD_ERROR';

      db.query.mockRejectedValue(dbError);

      const res = await request(app)
        .get('/peer-sessions/list?page=1&limit=4');

      expect(res.status).toBe(409);
      expect(res.body).toEqual({
        error: 'Error al consultar el historial.',
      });
    });
  });
});