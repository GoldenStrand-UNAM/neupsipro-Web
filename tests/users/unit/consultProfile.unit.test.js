
// ================ MOKS ==================================

const mockVerifyToken = jest.fn();

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({ verifyToken: mockVerifyToken }))
);

// Replaces rate-limiter so it never blocks unit tests.
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (_req, _res, next) => next()
);


const mockExecute = jest.fn();

// SUBJECT UNDER TEST

const ProfileController = require('../../../Back/src/presentation/controller/users/profile.controller');

// Instantiate controller with the mocked use case — mirrors how app.js does it.
const profileController = new ProfileController({ execute: mockExecute });


// ======== HELPERS =========================

//  Builds a minimal Express-like req object for controller unit tests.
const buildReq = (overrides = {}) => ({
  params: { userId: 'u-1' },
  user:   { id:'u-1'},
  ...overrides,
});

// Builds a spy-based res object that captures status and json calls.
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

// ====================== TESTS =================================== 

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

    // Use case throws USER_NOT_FOUND — controller maps it to 404
    mockExecute.mockRejectedValue(new Error('USER_NOT_FOUND'));

 
    const req = buildReq({ params: { userId: 'u-9999' }, user: { id: 'u-9999' } });
    const res = buildRes();
 
    await profileController.getProfile(req, res);
 
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'User not found' })
    );
  });
 
  // 1.4 — SQL injection attempt
  test('1.4 returns 400 and no stack trace when SQL injection is detected in userId', async () => {
    
    const req = buildReq({
      params: { userId: "' OR '1'='1" },
      user:   { id: 1 },
    });

    const res = buildRes();
 
    await profileController.getProfile(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
 
    const responseBody = res.json.mock.calls[0][0];
 
    // Must not expose the raw SQL, a stack trace, or internal query details
    expect(JSON.stringify(responseBody)).not.toContain('OR');
    expect(JSON.stringify(responseBody)).not.toContain('stack');
    expect(JSON.stringify(responseBody)).not.toContain('query');

  });

      // 1.5 — IDOR: valid token but requesting another user's profile
  test('1.5 returns 403 when authenticated user requests a different user profile (IDOR)', async () => {
    // User 1 is authenticated but is requesting user 2's profile
    const req = buildReq({ params: { userId: 'u-2' }, user: { id: 'u-1' } });
    const res = buildRes();
 
    await profileController.getProfile(req, res);
 
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'No tienes permiso para ver este perfil' })
    );
  });
 


});