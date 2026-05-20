 
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
 
// ===================== SUBJECT UNDER TEST ================================
 
const InterventionController = require('../../../Back/src/presentation/controller/interventions/intervention.controller');
 
const interventionController = new InterventionController({
  addSession: { execute: mockExecute },
});
 
// ===================== HELPERS ===========================================
 
/**
 * Valid base session payload used across all tests.
 * Each test only overrides the specific field it wants to attack.
 */
const validSessionBody = () => ({
  session_number  : 1,
  session_date    : '2024-06-01',
  objectives      : 'Assess the patient initial state',
  development     : 'A structured clinical interview was conducted',
  dqp_task        : 'Complete the anxiety questionnaire',
});
 
const buildReq = (overrides = {}) => ({
  params: { id_user: 'u-1' },
  user:   { id: 'u-1', role: 'admin' },
  body:   validSessionBody(),
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
 
describe('UNIT — POST /users/:id_user/intervention/sessions · session inputs', () => {
  beforeEach(() => jest.clearAllMocks());
 
  // ------------------------------------------------------------------
  // 7.1 — User tries to submit images in the session creation inputs
  //       7.1.1 The system does not accept images and they are not stored
  // ------------------------------------------------------------------
  test('7.1 rejects an image data-URI in the objectives field with 400', async () => {
    // Testing the objectives field; the same rule applies to development and dqp_task.
    const imagePayload = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
 
    const req = buildReq({
      body: { ...validSessionBody(), objectives: imagePayload },
    });
    const res = buildRes();
 
    await interventionController.addSession(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();
  });
 
  test('7.1b rejects an image data-URI in the development field with 400', async () => {
    const imagePayload = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD';
 
    const req = buildReq({
      body: { ...validSessionBody(), development: imagePayload },
    });
    const res = buildRes();
 
    await interventionController.addSession(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();
  });

  });
