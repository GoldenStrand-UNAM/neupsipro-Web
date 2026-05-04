const request = require('supertest');

// ================ MOKS ==================================

/**
 * Controls auth behavior per test.
 * Default: passes through as unauthenticated (simulates real middleware refusing).
 */
let mockAuthBehavior = 'unauthenticated';
let mockAuthUserId   = null;

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({
    verifyToken: (req, res, next) => {
      if (mockAuthBehavior === 'unauthenticated') {
        return res.status(401).json({ message: 'No autorizado' });
      }
      if (mockAuthBehavior === 'expired') {
        return res.status(401).json({ message: 'Token expirado' });
      }
      // Authenticated: attach user identity to the request
      req.user = { id: mockAuthUserId };
      next();
    },
  }))
);

// Bypass rate limiter — not under test in this suite.
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (_req, _res, next) => next()
);

// Mock the profile service to avoid hitting a real database. 7
jest.mock('../../../Back/src/infrastructure/repositories/profileRepository', () => {
  return jest.fn().mockImplementation(() => ({
    getById: jest.fn(),
  }));
});


const app = require('../../../Back/src/app');

// ===================== HELPERS ===========================

// Sets auth state before each scenario.
const asAuthenticated = (userId) => {
  mockAuthBehavior = 'authenticated';
  mockAuthUserId   = userId;
};

const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };
const asExpiredToken    = () => { mockAuthBehavior = 'expired'; };

//  ==================== TESTS ===========================

describe('INTEGRATION — GET /api/profile/:userId/', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asUnauthenticated(); // safe default: every test must opt-in to auth
  });

  // 1.1 — No authentication token
  test('1.1 returns 401 when no token is provided', async () => {
    asUnauthenticated();

    const res = await request(app).get('/api/profile/1/');

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({ message: 'No autorizado' });
  });

});