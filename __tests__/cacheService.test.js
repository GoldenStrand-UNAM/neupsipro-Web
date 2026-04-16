/* global describe, test, expect, beforeEach */
const CacheService = require('../Back/src/infrastructure/external/memoryCache.service');

describe('Unit Test - CacheService', () => {
    let cacheService;
    const testUser = 'ricardo_test';

    beforeEach(() => {
        jest.useFakeTimers();
        cacheService = new CacheService();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('Debería iniciar con 0 intentos para un usuario nuevo', () => {
        const attempts = cacheService.getAttempts(testUser);
        expect(attempts).toBe(0);
    });

    test('Debería incrementar los intentos correctamente', () => {
        cacheService.incrementAttempts(testUser);
        cacheService.incrementAttempts(testUser);
        
        expect(cacheService.getAttempts(testUser)).toBe(2);
    });

    test('Debería limpiar los intentos de un usuario (Líneas 16-17)', () => {
        cacheService.incrementAttempts(testUser);
        cacheService.clearAttempts(testUser);
        
        expect(cacheService.getAttempts(testUser)).toBe(0);
    });

    test('Debería manejar correctamente la limpieza de un usuario que no existe (Línea 25)', () => {
        // Probamos limpiar a alguien que nunca se registró en el cache
        // Esto debería ejecutarse sin lanzar errores
        expect(() => {
            cacheService.clearAttempts('usuario_inexistente');
        }).not.toThrow();
        
        expect(cacheService.getAttempts('usuario_inexistente')).toBe(0);
    });

    test('Debería resetear intentos automáticamente después de 15 minutos (Línea del setTimeout)', () => {
        const user = 'bloqueado';
        
        // 1. Incrementamos hasta llegar a 4 para disparar el if (newCount === 4)
        cacheService.incrementAttempts(user); // 1
        cacheService.incrementAttempts(user); // 2
        cacheService.incrementAttempts(user); // 3
        cacheService.incrementAttempts(user); // 4 -> Aquí se dispara el setTimeout

        // 2. Verificamos que aún tiene 4 intentos
        expect(cacheService.getAttempts(user)).toBe(4);

        // 3. VIAJE EN EL TIEMPO: Adelantamos el reloj 15 minutos
        jest.advanceTimersByTime(15 * 60 * 1000);

        // 4. Ahora debería estar limpio
        expect(cacheService.getAttempts(user)).toBe(0);
    });

    test('Debería limpiar intentos manualmente con clearAttempts', () => {
        cacheService.incrementAttempts('user1');
        cacheService.clearAttempts('user1');
        expect(cacheService.getAttempts('user1')).toBe(0);
    });
});