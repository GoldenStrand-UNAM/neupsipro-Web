/* global describe, test, expect, beforeEach */
const HashingService = require('../Back/src/infrastructure/external/hashing.service');

describe('Unit Test - HashingService', () => {
    let hashingService;
    const passwordPlana = 'mi_clave_secreta_123';

    beforeEach(() => {
        hashingService = new HashingService();
    });

    test('Debería generar un hash diferente al texto plano', async () => {
        const hash = await hashingService.hash(passwordPlana);
        
        expect(hash).toBeDefined();
        expect(hash).not.toBe(passwordPlana);
        // Los hashes de bcrypt suelen empezar con $2b$ o $2a$
        expect(hash.startsWith('$2')).toBe(true);
    });

    test('Debería retornar true cuando la contraseña coincide con el hash', async () => {
        const hash = await hashingService.hash(passwordPlana);
        const coinciden = await hashingService.compare(passwordPlana, hash);
        
        expect(coinciden).toBe(true);
    });

    test('Debería retornar false cuando la contraseña NO coincide', async () => {
        const hash = await hashingService.hash(passwordPlana);
        const coinciden = await hashingService.compare('otra_password_incorrecta', hash);
        
        expect(coinciden).toBe(false);
    });
});