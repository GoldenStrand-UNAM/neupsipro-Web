 
// ===================== MOCKS =============================================
 
jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({ verifyToken: jest.fn() }))
);
 
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter:      (req, res, next) => next(),
  generalLimiter:    (req, res, next) => next(),
  apiLimiter:        (req, res, next) => next(),
  publicationLimiter:(req, res, next) => next(),
}));

const mockExecute = jest.fn();
 
// ===================== SUBJECT UNDER TEST ================================
 
const InterventionController = require('../../../Back/src/presentation/controller/interventions/intervention.controller');
 
const interventionController = new InterventionController(
  { execute: jest.fn() },  // getIntervention
  { execute: jest.fn() },  // updateContract
  { execute: jest.fn() },  // addSession
  { execute: mockExecute } // deleteSession
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
 
    await interventionController.deleteSession(req, res);
 
    expect(mockExecute).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

   // FS01 — SQL injection in id_session.
  test('FS01 accepts SQL injection in id_session as plain string and responds 200', async () => {
    mockExecute.mockResolvedValue({ success: true });
 
    const req = buildReq({
      params: { id_user: 'u-1', id_session: "1; DROP TABLE intervention_session; --" },
    });
    const res = buildRes();
 
    await interventionController.deleteSession(req, res);
 
    expect(res.status).toHaveBeenCalledWith(200);
 
    const body = JSON.stringify(res.json.mock.calls[0][0]);
    expect(body).not.toContain('DROP');
    expect(body).not.toContain('stack');
  });
 
  // FE01 — Database fails during deletion.
  test('FE01 responds 400 when the database fails during deletion', async () => {
    mockExecute.mockRejectedValue(new Error('DB_ERROR'));
 
    const req = buildReq();
    const res = buildRes();
 
    await interventionController.deleteSession(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
 
    const body = JSON.stringify(res.json.mock.calls[0][0]);
    expect(body).not.toContain('stack');
  });
 
  // FE02 — Database connection lost during deletion.
  test('FE02 responds 400 when the database connection is lost', async () => {
    mockExecute.mockRejectedValue(new Error('ECONNREFUSED'));
 
    const req = buildReq();
    const res = buildRes();
 
    await interventionController.deleteSession(req, res);
 
    expect(res.status).toHaveBeenCalledWith(400);
 
    const body = JSON.stringify(res.json.mock.calls[0][0]);
    expect(body).not.toContain('stack');
  });
 
  // Alternating flow — id_session is not the last session.
  test('responds 400 when the session does not belong to the user', async () => {
      mockExecute.mockRejectedValue(new Error('La sesión no existe o no pertenece a este usuario'));

      const req = buildReq();
      const res = buildRes();

      await interventionController.deleteSession(req, res);

      expect(res.status).toHaveBeenCalledWith(400);

      const body = JSON.stringify(res.json.mock.calls[0][0]);
      expect(body).not.toContain('stack');
  });

});