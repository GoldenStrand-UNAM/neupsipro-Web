/* global describe, test, expect, jest, beforeEach */

// 1. Usamos nombres distintos para que no choquen
const AuthRepositoryInfra = require('../Back/src/infrastructure/repositories/AuthRepository');
const AuthRepositoryDomain = require('../Back/src/domain/Repository/AuthRepository');

describe('Unit Tests - AuthRepository', () => {

    // --- GRUPO 1: TEST DE LA INTERFAZ (DOMINIO) ---
    describe('Domain Interface', () => {
        test('Debería lanzar error si se llama a invalidateSession directamente (Línea 3)', () => {
            const repository = new AuthRepositoryDomain();
            expect(() => {
                repository.invalidateSession('algun-token');
            }).toThrow("Method not implemented");
        });
    });

    // --- GRUPO 2: TEST DE LA IMPLEMENTACIÓN (INFRAESTRUCTURA) ---
    describe('Infrastructure Implementation', () => {
        let authRepository;
        let mockDb;

        beforeEach(() => {
            mockDb = {
                execute: jest.fn()
            };
            // Usamos la versión de Infraestructura
            authRepository = new AuthRepositoryInfra(mockDb);
        });

        test('Debería encontrar un usuario por username (findByUsername)', async () => {
            const mockUser = { id: 1, user_name: 'ricardo_test', password: 'hashed_password' };
            mockDb.execute.mockResolvedValue([[mockUser]]);

            const user = await authRepository.findByUsername('ricardo_test');

            expect(user).toEqual(mockUser);
            expect(mockDb.execute).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM users WHERE user_name = ?'),
                ['ricardo_test']
            );
        });

        test('Debería retornar null si el username no existe', async () => {
            mockDb.execute.mockResolvedValue([[]]);
            const user = await authRepository.findByUsername('fantasma');
            expect(user).toBeNull();
        });

        test('Debería lanzar error si la base de datos falla', async () => {
            mockDb.execute.mockRejectedValue(new Error('Conexión perdida'));
            await expect(authRepository.findByUsername('admin'))
                .rejects.toThrow('Error al consultar base de datos');
        });

        test('Debería retornar true al invalidar sesión exitosamente', async () => {
            mockDb.execute.mockResolvedValue([{ affectedRows: 1 }, null]);
            const result = await authRepository.invalidateSession('token_valido');
            expect(result).toBe(true);
        });

        test('Debería capturar el error y lanzar Error al invalidar sesión (Bloque catch)', async () => {
            mockDb.execute.mockRejectedValue(new Error('DB Error'));
            await expect(authRepository.invalidateSession('token_cualquiera'))
                .rejects.toThrow('Error al invalidar sesión');
        });
    });
});