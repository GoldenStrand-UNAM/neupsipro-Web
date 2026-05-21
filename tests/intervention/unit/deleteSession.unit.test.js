 
// ===================== MOCKS =============================================
 
jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({ verifyToken: jest.fn() }))
);
 
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (_req, _res, next) => next()
);
 
const mockExecute = jest.fn();
 
// ===================== SUBJECT UNDER TEST ================================
 
const InterventionController = require('../../../Back/src/presentation/controller/interventions/intervention.controller');
 
const interventionController = new InterventionController(
  { execute: jest.fn() },  // getIntervention
  { execute: jest.fn() },  // updateContract
  { execute: jest.fn() },  // addSession
  { execute: mockExecute } // deleteLastSession
);
 
// ===================== HELPERS ===========================================
 
const buildReq = (overrides = {}) => ({
  params: { id_user: 'u-1', id_session: 's-1' },
  user:   { id: 'u-1', role: 'admin' },
  ...overrides,
});
 
const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};
 
// ===================== TESTS =============================================
 
afterAll(() => jest.clearAllMocks());
 
describe('UNIT — DELETE /users/:id_user/intervention/sessions/:id_session', () => {
  beforeEach(() => jest.clearAllMocks());
 
  test('base — responds 200 when the last session is successfully deleted', async () => {
    mockExecute.mockResolvedValue({ success: true });
 
    const req = buildReq();
    const res = buildRes();
 
    await interventionController.deleteLastSession(req, res);
 
    expect(mockExecute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

});