/* global describe, test, expect, jest, afterEach */
const mysql = require('mysql2');

// Mockear mysql2 ANTES de requerir el archivo de database
jest.mock('mysql2', () => {
    const mPool = {
        getConnection: jest.fn(),
        promise: jest.fn().mockReturnThis(),
    };
    return {
        createPool: jest.fn(() => mPool),
    };
});

describe('Unit Test - Database Connection', () => {
    
    afterEach(() => {
        jest.clearAllMocks();
        // Limpiamos el cache del modulo para que se vuelva a ejecutar el pool.getConnection
        jest.resetModules(); 
    });

    test('Debería loguear éxito cuando la conexión es correcta (Líneas 17-19)', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const mockConnection = { release: jest.fn() };
        const mysql = require('mysql2');
        const pool = mysql.createPool();

        // Simulamos que getConnection no devuelve error
        pool.getConnection.mockImplementation((callback) => callback(null, mockConnection));

        // Requerimos el archivo para que se ejecute la lógica
        require('../Back/src/infrastructure/database/database');

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Successfully connected'));
        expect(mockConnection.release).toHaveBeenCalled();
        
        consoleSpy.mockRestore();
    });

    test('Debería loguear error cuando la conexión falla (Líneas 14-16)', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
        const mysql = require('mysql2');
        const pool = mysql.createPool();

        // Simulamos un error de conexión
        const mockError = new Error('Conexión rechazada');
        pool.getConnection.mockImplementation((callback) => callback(mockError));

        require('../Back/src/infrastructure/database/database');

        expect(consoleErrorSpy).toHaveBeenCalledWith('Database connection error:', mockError);
        
        consoleErrorSpy.mockRestore();
    });
});