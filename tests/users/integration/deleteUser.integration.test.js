const request = require('supertest');
const db = require('../../../Back/src/infrastructure/database/database'); // Ajusta la ruta a tu db

// ================ MOCKS ==================================

let mockAuthBehavior = 'unauthenticated';
let mockAuthUserId   = null;

// Mock del Middleware de Auth (Copiado de tu ejemplo funcional)
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

// Mock de la Base de Datos
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

describe('INTEGRATION — DELETE /users/:id_user', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthBehavior = 'unauthenticated';
  });

  test('Debe retornar 200 si el usuario es eliminado correctamente', async () => {
    asAuthenticated(1);

    // Mock de fetchOne: El repositorio hace userData.map, así que necesitamos una estructura de filas
    // userData[0] es el resultado del query
    db.query.mockResolvedValueOnce([
      [{ id_user: '123', first_name: 'Test' }],
      [] // userData[0]
    ]);

    // Mock de softDeleteUser: result.affectedRows > 0
    db.query.mockResolvedValueOnce([
      { affectedRows: 1 },
      []
    ]);

    const res = await request(app)
      .delete('/users/123');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Debe retornar 404 si el usuario no existe en DB', async () => {
    asAuthenticated(1);

    // Mock de fetchOne devolviendo array de datos vacío
    db.query.mockResolvedValueOnce([[], []]);

    const res = await request(app).delete('/users/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('User not found');
  });

  test('Debe retornar 400 si el id_user no es válido o falta', async () => {
    asAuthenticated(1);
    
    // Si tu useCase lanza error por falta de id_user
    const res = await request(app).delete('/users/%20');

    expect(res.status).toBe(400);
  });

  test('Debe retornar 401 si no está autenticado', async () => {
    // mockAuthBehavior es 'unauthenticated' por defecto en beforeEach
    const res = await request(app).delete('/users/123');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('No autorizado');
  });
});