// ===================== MOCKS =============================================

const mockVerifyToken = jest.fn();

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({ verifyToken: mockVerifyToken }))
);

// El rate limiter nunca bloquea en pruebas unitarias.
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (_req, _res, next) => next()
);

const mockExecute = jest.fn();

// ===================== TESTING ================================

const InterventionController = require('../../../Back/src/presentation/controller/intervention/intervention.controller');

// Se instancia igual que lo hace app.js: inyectando el use case mockeado.
const interventionController = new InterventionController({
  updateContract: { execute: mockExecute },
});

// ===================== HELPERS ===========================================

/**
 * mocks data for the controller
 */
const buildReq = (overrides = {}) => ({
  params: { id_user: 'u-1' },
  user:   { id: 'u-1', role: 'admin' },
  body:   { contract_link: 'https://example.com/contrato.pdf', neuro_profile: '' },
  ...overrides,
});

/**
 * Build the res for getting the json and status data 
 */
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};
