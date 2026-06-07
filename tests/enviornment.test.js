describe('Configuración de ambiente', () => {

    test('las variables de ambiente de test están definidas', () => {
        expect(process.env.NODE_ENV).toBeDefined();
        expect(process.env.PORT).toBeDefined();
        expect(process.env.APP_NAME).toBeDefined();
    });

    test('el ambiente es test', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });

    test('el puerto de test es 3000', () => {
        expect(process.env.PORT).toBe('3000');
    });

    test('el nombre de la app es Local', () => {
        expect(process.env.APP_NAME).toBe('Local');
    });

});