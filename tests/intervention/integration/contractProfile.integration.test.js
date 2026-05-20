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
let rateLimitBehavior = 'allow';
 
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (req, res, next) => {
    if (rateLimitBehavior === 'limit') {
      return res.status(429).json({ message: 'Too many requests' });
    }
    next();
  }
);
 
// --- Testing ---
const mockExecuteUpdate = jest.fn();
 
jest.mock('../../../Back/src/application/usecase/intervention/updateContractUseCase', () =>
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
const enableRateLimit   = () => { rateLimitBehavior = 'limit'; };
const disableRateLimit  = () => { rateLimitBehavior = 'allow'; };
 
/** Valid base payload used across all tests. */
const validBody = () => ({
  contract_link : 'https://example.com/contract.pdf',
  neuro_profile : 'Initial neuropsychological profile of the patient.',
});