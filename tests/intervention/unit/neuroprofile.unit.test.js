// ===================== MOCKS =============================================
 
const mockVerifyToken = jest.fn();
 
jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({ verifyToken: mockVerifyToken }))
);
 
// The rate limiter never blocks in unit tests.
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (_req, _res, next) => next()
);
 
const mockExecute = jest.fn();
 
// ===================== Testing ================================
 
const InterventionController = require('../../../Back/src/presentation/controller/interventions/intervention.controller');
 
const interventionController = new InterventionController({
  updateContract: { execute: mockExecute },
});
 
// ===================== HELPERS ===========================================
 
const buildReq = (overrides = {}) => ({
  params: { id_user: 'u-1' },
  user:   { id: 'u-1', role: 'admin' },
  body:   { contract_link: '', neuro_profile: 'Base profile' },
  ...overrides,
});
 
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};
 
// ===================== TESTS =============================================
 
// Close any handles left open by the module under test (prevents worker-leak warning).
afterAll(() => jest.clearAllMocks());
 
describe('UNIT — PATCH /users/:id_user/intervention · neuro_profile', () => {
  beforeEach(() => jest.clearAllMocks());
 
  // ------------------------------------------------------------------
  // 3.1 — User tries to submit an image in the neuro_profile input
  //       3.1.1 The system does not accept images and they are not stored
  // ------------------------------------------------------------------
  test('3.1 rejects an image data-URI in neuro_profile with 400', async () => {
    const imagePayload = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
 
    const req = buildReq({ body: { neuro_profile: imagePayload } });
    const res = buildRes();
 
    await interventionController.updateContract(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();
  });

  // ------------------------------------------------------------------
  // 3.2 — User tries to inject SQL in neuro_profile
  //       3.2.1 The system treats it as a plain string
  // ------------------------------------------------------------------
  test('3.2 rejects an SQL injection payload in neuro_profile with 400', async () => {

    // neuro_profile is free-text but the controller still rejects it
    const sqlPayload = "'; DELETE FROM users; --";
 
    const req = buildReq({ body: { neuro_profile: sqlPayload } });
    const res = buildRes();
 
    await interventionController.updateContract(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();
 
    const body = JSON.stringify(res.json.mock.calls[0][0]);
    expect(body).not.toContain('DELETE');
    expect(body).not.toContain('stack');
  });
 
  // ------------------------------------------------------------------
  // 3.3 — User tries to submit 10,000 characters in neuro_profile
  //       3.3.1 The system does not allow it
  // ------------------------------------------------------------------
  test('3.3 rejects a 10,000-character neuro_profile with 400', async () => {
    const longPayload = 'x'.repeat(10_000);
 
    const req = buildReq({ body: { neuro_profile: longPayload } });
    const res = buildRes();
 
    await interventionController.updateContract(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();
 
    const body = res.json.mock.calls[0][0];
    const hasErrorKey = 'message' in body || 'error' in body;
    expect(hasErrorKey).toBe(true);
    expect(JSON.stringify(body)).not.toContain('stack');
    expect(JSON.stringify(body)).not.toContain('at Object.');
  });

  });
