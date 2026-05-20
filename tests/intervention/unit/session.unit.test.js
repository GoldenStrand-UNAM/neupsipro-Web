 
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
 