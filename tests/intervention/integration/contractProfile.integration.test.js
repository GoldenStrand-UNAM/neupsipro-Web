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
// Passes through by default; activated for case 3.4.
let mockRateLimitBehavior = 'allow';
 
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (req, res, next) => {
    if (mockRateLimitBehavior === 'limit') {
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
const enableRateLimit   = () => { mockRateLimitBehavior = 'limit'; };
const disableRateLimit  = () => { mockRateLimitBehavior = 'allow'; };
 
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

  });
