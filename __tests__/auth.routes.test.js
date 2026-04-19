/* global describe, test, expect, jest */
const authRoutes = require('../Back/src/presentation/routes/auth/auth.routes');

describe('Unit Test - Auth Routes', () => {
    test('Debería configurar correctamente las rutas de login y logout', () => {
        // 1. Mocks de los controladores
        const mockLoginController = {
            getLogin: jest.fn(),
            postLogin: jest.fn()
        };
        const mockLogoutController = {
            logout: jest.fn()
        };

        // 2. Ejecutamos la función que exporta el archivo de rutas
        const router = authRoutes(mockLogoutController, mockLoginController);

        // 3. Buscamos las rutas registradas en el stack de Express
        // Esto sirve para verificar que los métodos y paths sean los correctos
        const routes = router.stack.map(layer => ({
            path: layer.route.path,
            method: Object.keys(layer.route.methods)[0]
        }));

        expect(routes).toContainEqual({ path: '/', method: 'get' });
        expect(routes).toContainEqual({ path: '/login', method: 'post' });
        expect(routes).toContainEqual({ path: '/logout', method: 'post' });

        // 4. PARA EL 100% COVERAGE: Ejecutar manualmente los handlers
        // Esto dispara las funciones (req, res) => ... que Jest marca como no cubiertas
        const req = {};
        const res = {};

        // Simulamos la ejecución de cada ruta
        router.stack[0].route.stack[0].handle(req, res); // GET /
        expect(mockLoginController.getLogin).toHaveBeenCalled();

        router.stack[1].route.stack[0].handle(req, res); // POST /login
        expect(mockLoginController.postLogin).toHaveBeenCalled();

        router.stack[2].route.stack[0].handle(req, res); // POST /logout
        expect(mockLogoutController.logout).toHaveBeenCalled();
    });
});