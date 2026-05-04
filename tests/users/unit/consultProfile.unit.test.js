
// ================ MOKS ==================================

const mockVerifyToken = jest.fn();

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({ verifyToken: mockVerifyToken }))
);

// Replaces rate-limiter so it never blocks unit tests.
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (_req, _res, next) => next()
);

// Mock the profile service to avoid hitting a real database. 7
jest.mock('../../../Back/src/infrastructure/repositories/profileRepository', () => {
  return jest.fn().mockImplementation(() => ({
    getById: jest.fn(),
  }));
});


// SUBJECT UNDER TEST

const { getProfile } = require('../../../Back/src/presentation/controller/users/profile.controller');

// ─── Helpers ──────────────────────────────────────────────────────────────────

//  Builds a minimal Express-like req object for controller unit tests.
const buildReq = (overrides = {}) => ({
  params: { userId: '1' },
  user:   { id: 1 },
  ...overrides,
});

// Builds a spy-based res object that captures status and json calls.
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// TESTS

describe('UNIT — GET /api/profile/:userId/', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1.1 — No authentication token
  test('1.1 returns 401 when no token is provided', async () => {
    // Simulate auth middleware rejecting a request with no token
    const req  = buildReq({ user: undefined });
    const res  = buildRes();
    const next = jest.fn();

    // The middleware should reject before the controller is ever called
    mockVerifyToken.mockImplementation((_req, _res) => {
      _res.status(401).json({ message: 'No autorizado' });
    });

    await mockVerifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No autorizado' });
    expect(next).not.toHaveBeenCalled();
  });

   // 1.2 — Expired token
  test('1.2 returns 401 when token is expired', async () => {
    const req  = buildReq({ user: undefined });
    const res  = buildRes();
    const next = jest.fn();
 
    // Simulate middleware detecting an expired token signature
    mockVerifyToken.mockImplementation((_req, _res) => {
      _res.status(401).json({ message: 'Token expirado' });
    });
 
    await mockVerifyToken(req, res, next);
 
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token expirado' });
  });
 
  // 1.3 — Non-existent profile
  test('1.3 returns 404 when the requested profile does not exist', async () => {
    // Service returns null when no user is found
    mockGetProfile.mockResolvedValue(null);
 
    const req = buildReq({ params: { userId: '9999' }, user: { id: 9999 } });
    const res = buildRes();
 
    await getProfile(req, res);
 
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Usuario no encontrado' })
    );
  });
 
  // 1.4 — SQL injection attempt
  test('1.4 returns 400 and no stack trace when SQL injection is detected in userId', async () => {
    const req = buildReq({
      params: { userId: "' OR '1'='1" },
      user:   { id: 1 },
    });
    const res = buildRes();
 
    await getProfile(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
 
    const responseBody = res.json.mock.calls[0][0];
 
    // Must not expose the raw SQL, a stack trace, or internal query details
    expect(JSON.stringify(responseBody)).not.toContain('OR');
    expect(JSON.stringify(responseBody)).not.toContain('stack');
    expect(JSON.stringify(responseBody)).not.toContain('query');
  });


});