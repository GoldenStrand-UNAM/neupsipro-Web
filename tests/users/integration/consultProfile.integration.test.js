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
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter:      (req, res, next) => next(),
  generalLimiter:    (req, res, next) => next(),
  apiLimiter:        (req, res, next) => next(),
  publicationLimiter:(req, res, next) => next(),
  userLimiter:       (req, res, next) => next(),
}));

const mockGetProfile = jest.fn();

// Mock the profile service to avoid hitting a real database. 7
jest.mock('../../../Back/src/infrastructure/repositories/ImpProfileRepository', () => {
  return jest.fn().mockImplementation(() => ({
    getById: mockGetProfile,
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

      const res = await request(app).get('/api/profile/u-1/');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: 'No autorizado' });
    });

  // 1.2 — Expired token
    test('1.2 returns 401 when the token is expired', async () => {
      asExpiredToken();

      const res = await request(app).get('/api/profile/u-1/');

      expect(res.status).toBe(401);
      expect(res.body).toMatchObject({ message: 'Token expirado' });
    });

    // 1.3 — Non-existent profile
      test('1.3 returns 404 when the requested profile does not exist', async () => {
        asAuthenticated('u-9999');
        mockGetProfile.mockResolvedValue(null);
    
        const res = await request(app).get('/api/profile/u-9999/');
    
        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({ message: 'User not found' });
      });

    // 1.4 — SQL injection
      test('1.4 returns 400 and exposes no internal details when SQL injection is attempted', async () => {
        asAuthenticated(1);
    
        const sqlPayload = encodeURIComponent("' OR '1'='1");
        const res        = await request(app).get(`/api/profile/${sqlPayload}/`);
    
        expect(res.status).toBe(400);
    
        const rawBody = JSON.stringify(res.body);
    
        // Must not leak any query internals, stack traces, or SQL fragments
        expect(rawBody).not.toContain('stack');
        expect(rawBody).not.toContain('query');
        expect(rawBody).not.toContain('OR');
        expect(rawBody).not.toContain('syntax');
      });

    // 1.5 — IDOR: accessing another user's profile
      test('1.5 returns 403 when a user requests a profile that is not their own (IDOR)', async () => {

        // User u-1 is authenticated but tries to access user 2's profile
        asAuthenticated(1);
    
        const res = await request(app).get('/api/profile/u-2/');
    
        expect(res.status).toBe(403);
        expect(res.body).toMatchObject({
          message: 'No tienes permiso para ver este perfil',
        });
      });
  

});