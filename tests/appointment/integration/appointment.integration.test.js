const request = require('supertest');

// ================ MOCKS ==================================
let mockAuthBehavior = 'unauthenticated';
let mockAuthUserId = null;

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({
    verifyToken: (req, res, next) => {
      if (mockAuthBehavior === 'unauthenticated') return res.status(401).json({ message: 'No autorizado' });
      req.user = { id: mockAuthUserId };
      next();
    },
  }))
);

// Mock Permissions Middleware 
jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () =>
  jest.fn(() => ({
    requirePermission: () => (req, res, next) => next(),
  }))
);

const mockFindUpcoming = jest.fn();
const mockFindOrCreateRelation = jest.fn();
const mockCreateApp = jest.fn();
const mockDeleteApp = jest.fn();

jest.mock('../../../Back/src/infrastructure/repositories/ImpAppointmentRepository', () => {
  return jest.fn().mockImplementation(() => ({
    findUpcomingByUser: mockFindUpcoming,
    findOrCreateUserRelation: mockFindOrCreateRelation,
    createAppointment: mockCreateApp,
    deleteUpcomingByUser: mockDeleteApp,
  }));
});

const app = require('../../../Back/src/app');

// ===================== TESTS ===========================

describe('INTEGRATION — Appointment Routes', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockAuthBehavior = 'authenticated';
  });

  describe('POST /users/:id_user/appointments', () => {
    test('2.1 Successfully creates an appointment', async () => {
      mockFindUpcoming.mockResolvedValue(null);
      mockFindOrCreateRelation.mockResolvedValue('rel-123');
      mockCreateApp.mockResolvedValue('app-456');

      const res = await request(app)
        .post('/users/u-1/appointments')
        .send({
          id_clinic_user: 'c-1',
          issue: 'Consultation',
          date_time: '2026-12-01 10:00:00'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.idAppointment).toBe('app-456');
    });

    test('2.2 returns 400 when date is invalid', async () => {
      const res = await request(app)
        .post('/users/u-1/appointments')
        .send({
          id_clinic_user: 'c-1',
          issue: 'Consultation',
          date_time: 'not-a-date'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Fecha inválida');
    });
  });

  describe('DELETE /users/:id_user/appointments', () => {
    test('3.1 returns 404 when no upcoming appointment exists', async () => {
      mockFindUpcoming.mockResolvedValue(null);

      const res = await request(app).delete('/users/u-1/appointments');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('No hay una cita próxima para eliminar');
    });

    test('3.2 returns 200 when deletion is successful', async () => {
      mockFindUpcoming.mockResolvedValue({ idAppointment: 'app-1' });
      mockDeleteApp.mockResolvedValue(true);

      const res = await request(app).delete('/users/u-1/appointments');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cita eliminada correctamente');
    });
  });
});