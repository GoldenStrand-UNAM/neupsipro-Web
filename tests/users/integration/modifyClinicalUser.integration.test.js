const request = require('supertest');
const db = require('../../../Back/src/infrastructure/database/database');

// ================ MOCKS ==================================
let mockAuthBehavior = 'unauthenticated';
let mockAuthUserId   = null;

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({
    verifyToken: (req, res, next) => {
      if (mockAuthBehavior === 'unauthenticated') {
        return res.status(401).json({ message: 'No autorizado' });
      }
      req.user = { id: 1, role: 'admin' };
      next();
    },
  }))
);

jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () => {
    return jest.fn().mockImplementation(() => {
        return {
            requirePermission: () => (req, res, next) => next()
        };
    });
});

jest.mock('../../../Back/src/infrastructure/database/database', () => ({
  query: jest.fn()
}));

const app = require('../../../Back/src/app');

// ===================== HELPERS ===========================
const asAuthenticated = (userId) => {
  mockAuthBehavior = 'authenticated';
  mockAuthUserId   = userId;
};

// ===================== TESTS =============================
describe('INTEGRATION — Edit  /clinical/:id_user/edit', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthBehavior = 'unauthenticated';
  });

  test('must return 200 if the affiliation is updated successfully', async () => {
    asAuthenticated(1);

    db.query.mockResolvedValueOnce([
      [{ id_user: '123', first_name: 'Test' }],
      []
    ]);

    db.query.mockResolvedValueOnce([
      { affectedRows: 1 },
      []
    ]);
      db.query.mockResolvedValueOnce([
    [{ id_user: '123', affiliation: 'Tigres' }],
    []
  ]);

    const res = await request(app)
      .patch('/clinical/123/edit')
      .send({ affiliation: 'Tigres' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

});