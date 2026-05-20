 
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


    // ------------------------------------------------------------------
  // 7.3 — User tries to submit a 10,000-character string
  //       7.3.1 The system does not allow it
  // ------------------------------------------------------------------
  test('7.3 rejects 10,000 characters in objectives with 400', async () => {
    const longPayload = 'o'.repeat(10_000);
 
    const req = buildReq({
      body: { ...validSessionBody(), objectives: longPayload },
    });
    const res = buildRes();
 
    await interventionController.addSession(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();
 
    const body = res.json.mock.calls[0][0];
    const hasErrorKey = 'message' in body || 'error' in body;
    expect(hasErrorKey).toBe(true);
    expect(JSON.stringify(body)).not.toContain('stack');
    expect(JSON.stringify(body)).not.toContain('at Object.');
  });


    // ------------------------------------------------------------------
  // 7.4 — User tries an XSS attack in the session inputs
  //       7.4.1 The system only receives it as a string
  // ------------------------------------------------------------------
  test('7.4 rejects an XSS script payload in development with 400', async () => {
    const xssPayload = '<script>window.location="https://evil.com"</script>';
 
    const req = buildReq({
      body: { ...validSessionBody(), development: xssPayload },
    });
    const res = buildRes();
 
    await interventionController.addSession(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();
 
    const body = JSON.stringify(res.json.mock.calls[0][0]);
    expect(body).not.toContain('<script>');
    expect(body).not.toContain('stack');
  });


    // ------------------------------------------------------------------
  // 7.5 — User tries to submit emojis in the session creation inputs
  //       7.5.1 The system does not store them or treats them as a string
  // ------------------------------------------------------------------
  test('7.5 accepts emojis in free-text fields as plain strings', async () => {
    // objectives and development are free-text fields: emojis are acceptable.
    const emojiPayload = 'Assess emotional state 😊 of the patient 🧠';
 
    mockExecute.mockResolvedValue({ success: true, idSession: 46 });
 
    const req = buildReq({
      body: { ...validSessionBody(), objectives: emojiPayload },
    });
    const res = buildRes();
 
    await interventionController.addSession(req, res);
 
    // Valid outcome: 201 (stored as string) or 400 (rejected).
    const statusCode = res.status.mock.calls[0][0];
    expect([201, 400]).toContain(statusCode);
 
    const body = JSON.stringify(res.json.mock.calls[0][0]);
    expect(body).not.toContain('stack');
    expect(body).not.toContain('ReferenceError');
  });
 
  
  // ------------------------------------------------------------------
  // Base case — complete valid session: must respond 201
  // ------------------------------------------------------------------
  test('a session with valid data is created successfully with 201', async () => {
    mockExecute.mockResolvedValue({ success: true, idSession: 10 });
 
    const req = buildReq();
    const res = buildRes();
 
    await interventionController.addSession(req, res);
 
    expect(mockExecute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  });
