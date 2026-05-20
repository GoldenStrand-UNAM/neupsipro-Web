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

const InterventionController = require('../../../Back/src/presentation/controller/interventions/intervention.controller');

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

describe('UNIT — PATCH /users/:id_user/intervention · contract_link', () => {
  beforeEach(() => jest.clearAllMocks());
 
  // ------------------------------------------------------------------
  // 2.1 — User tries to submit an image in the contract_link input
  //       2.1.1 The system does not accept images and they are not stored
  // ------------------------------------------------------------------
  test('2.1 rejects an image data-URI in contract_link with 400', async () => {
    // The endpoint receives JSON; an image arrives as a base64 data-URI.
    const imagePayload = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA';
 
    const req = buildReq({ body: { contract_link: imagePayload } });
    const res = buildRes();
 
    await interventionController.updateContract(req, res);
 
    // The controller must reject the value before calling the use case.
    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();
  });


   // ------------------------------------------------------------------
  // 2.2 — User tries to inject SQL in contract_link
  //       2.2.1 The system treats it as a plain string (query is not executed)
  // ------------------------------------------------------------------
    test('2.2 rejects a URL containing SQL injection in the query string with 400', async () => {

    const sqlPayload = "https://example.com/files?id=' OR '1'='1; DROP TABLE intervention; --";

    const req = buildReq({ body: { contract_link: sqlPayload } });
    const res = buildRes();

    await interventionController.updateContract(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(mockExecute).not.toHaveBeenCalled();

    // The response must not leak SQL tokens, stack traces, or query internals.
    const body = JSON.stringify(res.json.mock.calls[0][0]);
    expect(body).not.toContain('DROP');
    expect(body).not.toContain('stack');
    expect(body).not.toContain('query');
    });
 

  // ------------------------------------------------------------------
  // 2.3 — User tries to submit a 10,000-character string
  //       2.3.1 The system does not allow it
  // ------------------------------------------------------------------
  test('2.3 rejects a 10,000-character contract_link with 400', async () => {
    const longPayload = 'a'.repeat(10_000);
 
    const req = buildReq({ body: { contract_link: longPayload } });
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