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
describe('INTEGRATION — patch /users/:id_user/protocol', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthBehavior = 'unauthenticated';
  });

  test('must return 200 if the protocol is updated successfully', async () => {
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
    [{ id_user: '123', protocol: 'Clinical' }],
    []
  ]);

    const res = await request(app)
      .patch('/users/123/protocol')
      .send({ protocol: 'Clinical' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('must return 404 if the user doesnt exist in the DB', async () => {
    asAuthenticated(1);

    db.query.mockResolvedValueOnce([[], []]);

    const res = await request(app)
      .patch('/users/999/protocol')
      .send({ protocol: 'Clinical' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('User not found');
  });

  test('must return 400 if protocol is missing in body', async () => {
    asAuthenticated(1);
    
    const res = await request(app)
      .patch('/users/123/protocol')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('(intermediate value) is not iterable'); 
  });

  test('must return 401 if not authenticated', async () => {
    const res = await request(app)
      .patch('/users/123/protocol')
      .send({ protocol: 'Clinical' });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No autorizado');
  });
});