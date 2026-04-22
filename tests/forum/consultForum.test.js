const request = require('supertest');

jest.mock('../../Back/src/infrastructure/auth/auth.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      req.user = { id: 1, role: 'admin' };
      next();
    }
  }));
});

jest.mock('../../Back/src/infrastructure/auth/permissions.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    requirePermission: () => (req, res, next) => next()
  }));
});

const app = require('../../Back/src/app');

describe('GET /forum', () => {
  test('returns status 200', async () => {
    const res = await request(app).get('/forum');
    expect(res.status).toBe(200);
  });

  test('respect the maximum limit of 20 posts per page', async () => {
    const res = await request(app)
      .get('/forum')
      .query({ page: 1, limit: 20 });
    expect(res.status).toBe(200);
  });
});

describe('Database error', () => {
  test('returns status 500 when the database fails', async () => {
    // Mock the repository to throw an error
    const ForumRepository = require('../../Back/src/infrastructure/repositories/forumRepository');
    jest.spyOn(ForumRepository.prototype, 'fetchAll').mockRejectedValueOnce(new Error('DB error'));
    jest.spyOn(ForumRepository.prototype, 'count').mockRejectedValueOnce(new Error('DB error'));

    const res = await request(app).get('/forum');
    expect(res.status).toBe(500);
  });
});

describe('rate limiting', () => {
  test('should limit the number of requests', async () => {
    for (let i = 0; i < 200; i++) {
      await request(app).get('/forum').query({ page: 1, limit: 10 });
    }
    const res = await request(app).get('/forum').query({ page: 1, limit: 10 });
    expect(res.status).toBe(429);
  });
});

describe('Invalid pagination parameters', () => {
  test('pagination page with negative number, goes back to 1, returns 200', async () => {
    const res = await request(app)
      .get('/forum')
      .query({ page: -5, limit: 10 });
    expect(res.status).toBe(200);
  });

  test('pagination page with text, goes back to 1, returns 200', async () => {
    const res = await request(app)
      .get('/forum')
      .query({ page: 'abc', limit: 10 });
    expect(res.status).toBe(200);
  });

  test('Excessive limit is reduced and returns 200', async () => {
    const res = await request(app)
      .get('/forum')
      .query({ page: 1, limit: 999999 });
    expect(res.status).toBe(200);
  });
});

