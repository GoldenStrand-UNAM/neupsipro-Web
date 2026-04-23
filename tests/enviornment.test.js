describe('Configuración de ambiente', () => {

    test('las variables de ambiente de test están definidas', () => {
        expect(process.env.NODE_ENV).toBeDefined();
        expect(process.env.PORT).toBeDefined();
        expect(process.env.APP_NAME).toBeDefined();
    });

    test('el ambiente es test', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });

    test('el puerto de test es 3001', () => {
        expect(process.env.PORT).toBe('3001');
    });

    test('el nombre de la app contiene Test', () => {
        expect(process.env.APP_NAME).toContain('Test');
    });

});