const request = require('supertest');

// ================ MOCKS ==================================

let mockAuthBehavior = 'unauthenticated';

// 1. Mock del Middleware 
jest.mock('../../../Back/src/infrastructure/auth/auth.middleware', () =>
  jest.fn(() => ({
    verifyToken: (req, res, next) => {
      if (mockAuthBehavior === 'unauthenticated') {
        return res.redirect('/auth/');
      }
      // Authenticated
      req.user = { userId: 1 }; 
      next();
    },
  }))
);

// 2. Mock del PermissionsMiddleware (Para saltar el requirePermission)
jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware', () =>
    jest.fn(() => ({
      requirePermission: () => (req, res, next) => next(), // Deja pasar cualquier módulo/acción
    }))
  );

// 3. Mock del ClinicalUseCase (Para devolver los datos del DTO)
const mockExecuteClinical = jest.fn();
jest.mock('../../../Back/src/application/Usecase/clinical/getClinicalUserUseCase', () => {
    return jest.fn().mockImplementation(() => ({
        execute: mockExecuteClinical,
    }));
});

// Bypass rate limiter
jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () =>
  () => (_req, _res, next) => next()
);

const app = require('../../../Back/src/app');

// ===================== HELPERS ===========================

const asAuthenticated = () => { mockAuthBehavior = 'authenticated'; };
const asUnauthenticated = () => { mockAuthBehavior = 'unauthenticated'; };

// ===================== TESTS =============================

describe('INTEGRATION — Consultar Usuario Clínico', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        asUnauthenticated();
    });

    // Flujo Alterno 4.1.1
    test('Debe redirigir a /auth/ cuando no hay sesión', async () => {
        asUnauthenticated();

        const res = await request(app).get('/clinical/1');

        expect(res.status).toBe(302);
        expect(res.header.location).toBe('/auth/');
    });

    // Flujo Básico 4
    test('Debe retornar 200 y renderizar datos cuando está autenticado', async () => {
        asAuthenticated();
        
        // Configuramos lo que debe devolver el Caso de Uso (basado en tu DTO)
        mockExecuteClinical.mockResolvedValue({
            idUser: 1,
            name: 'Dr. Gregory House',
            activity: 'Diagnostico',
            affiliation: 'Hospital',
            emergencyName: 'James Wilson',
            emergencyPhone: '555-123',
            emergencyRelation: 'Amigo',
            startDate: '2024-01-01',
            endDate: '2025-01-01',
            hours: 40
        });

        const res = await request(app).get('/clinical/1');

        if (res.status !== 200) {
            console.log("Cuerpo del error:", res.body);
        }

        expect(res.status).toBe(200);
    });
});