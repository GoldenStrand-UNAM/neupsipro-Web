const request = require('supertest');

jest.mock('../../Back/src/infrastructure/auth/auth.middleware', () => jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      req.user = { id: 1, role: 'admin' };
      next();
    },
  })));

jest.mock('../../Back/src/infrastructure/auth/permissions.middleware', () => jest.fn().mockImplementation(() => ({
    requirePermission: () => (req, res, next) => next(),
  })));

jest.mock('../../Back/src/infrastructure/external/rateLimiting', () => ({
  generalLimiter: (req, res, next) => next(),
  loginLimiter: (req, res, next) => next(),
}));

const ForumRepository = require('../../Back/src/infrastructure/repositories/forumRepository');

const app = require('../../Back/src/app');

describe('Publication Detail: GET /forum/publication/id ', () => {
  // Check Endpoint
  describe('GET /publication/:id', () => {
    test('retorn status 200', async () => {
      const response = await request(app).get('/publication/1');
      expect(response.status).toBe(200);
    });
  });

  test('returns 500 when server fails to get the  publication', async () => {
    jest.spyOn(ForumRepository.prototype, 'fetchOneUser').mockRejectedValueOnce(new Error('DB Error'));
    const res = await request(app).get('/publication/1');
    expect(res.status).toBe(500);
  });

  test(' When the publication is not found', async () => {
    jest.spyOn(ForumRepository.prototype, 'fetchOneUser').mockResolvedValueOnce([[]]);

    const res = await request(app).get('/publication/999999999');
    expect(res.status).toBe(200);
    expect(res.body.dto.status).toBe(false);
  });

});

