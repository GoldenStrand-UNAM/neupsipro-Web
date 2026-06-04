const request = require('supertest');
const db = require('../../../Back/src/infrastructure/database/database');

// 1. Mock de Autenticación (Estructurado como Clase)
jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      req.user = { id: 1, role: 'admin' };
      next(); // Dejamos pasar la petición
    }
  }));
});

// 2. Mock de Permisos (Estructurado como Clase)
jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    requirePermission: () => (req, res, next) => next()
  }));
});

// 3. Mock de Base de Datos
jest.mock('../../../Back/src/infrastructure/database/database', () => ({
  query: jest.fn()
}));

const app = require('../../../Back/src/app');

// 4. Mock del Caso de Uso
const deletePublicationUseCase = require('../../../Back/src/application/usecase/forum/deletePublicationUseCase');
jest.mock('../../../Back/src/application/usecase/forum/deletePublicationUseCase');

describe('Integración: DELETE /forum/:idPublication', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy path
  test('must return 200 & success message', async () => {
    deletePublicationUseCase.prototype.execute.mockResolvedValue({
      success: true,
      message: 'Publicación eliminada'
    });

    const response = await request(app)
      .delete('/api/publication/1') 
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Publicación eliminada'
    });
  });

// Publication not found
  test('must return 404 if publication not found', async () => {
    deletePublicationUseCase.prototype.execute.mockRejectedValue(
      new Error('Publicación no encontrada')
    );

    const response = await request(app)
      .delete('/api/publication/999')
      .send();

    expect(response.status).toBe(404); 
    expect(response.body.error).toBe('Publicación no encontrada');
  });

  // Internal error / Any other error
  test('must return 400 for any other error (e.g., database connection)', async () => {
    deletePublicationUseCase.prototype.execute.mockRejectedValue(
      new Error('Error de conexión a la base de datos')
    );

    const response = await request(app)
      .delete('/api/publication/1')
      .send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Error de conexión a la base de datos');
  });
});