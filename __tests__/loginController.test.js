/* global describe, test, expect, jest, beforeEach */
const LoginController = require('../Back/src/Presentation/controller/auth/login.controller');

describe('Unit Test - LoginController', () => {
    let loginController;
    let mockLoginUseCase;
    let req, res;

    beforeEach(() => {
        mockLoginUseCase = { execute: jest.fn() };
        loginController = new LoginController(mockLoginUseCase);
        
        req = {
            session: {},
            query: {},
            body: {},
            cookies: {}
        };
        
        res = {
            render: jest.fn(),
            redirect: jest.fn(),
            cookie: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('getLogin', () => {
        test('Debería renderizar la vista de login con mensajes de sesión vacíos', () => {
            loginController.getLogin(req, res);
            expect(res.render).toHaveBeenCalledWith("auth/login.ejs", expect.objectContaining({
                info: "",
                warning: ""
            }));
        });

        test('Debería limpiar los mensajes de sesión después de leerlos', () => {
            req.session.info = "Mensaje";
            loginController.getLogin(req, res);
            expect(req.session.info).toBe("");
        });
    });

    describe('postLogin', () => {
        test('Debería fallar si falta usuario o contraseña', async () => {
            req.body = { username: '' };
            await loginController.postLogin(req, res);
            expect(res.render).toHaveBeenCalledWith('login.ejs', {
                error: 'El usuario y la contraseña son obligatorios'
            });
        });

        test('Debería fallar si los inputs exceden 30 caracteres', async () => {
            req.body = { username: 'a'.repeat(31), password: '123' };
            await loginController.postLogin(req, res);
            expect(res.render).toHaveBeenCalledWith('login.ejs', {
                error: 'El usuario o la contraseña exceden el límite de 30 caracteres'
            });
        });

        test('Debería loguear exitosamente y poner la cookie', async () => {
            req.body = { username: 'ricardo', password: '123' };
            mockLoginUseCase.execute.mockResolvedValue('token_fake');

            await loginController.postLogin(req, res);

            expect(res.cookie).toHaveBeenCalledWith('jwt_token', 'token_fake', expect.any(Object));
            expect(res.redirect).toHaveBeenCalledWith('/home');
        });

        test('Debería renderizar error si el UseCase lanza una excepción (Catch)', async () => {
            req.body = { username: 'ricardo', password: '123' };
            mockLoginUseCase.execute.mockRejectedValue(new Error('Credenciales inválidas'));

            await loginController.postLogin(req, res);

            expect(res.render).toHaveBeenCalledWith('auth/login.ejs', { error: 'Credenciales inválidas' });
        });

        test('Debería limpiar el mensaje de warning si existe en la sesión (Línea 15)', () => {
            req.session.warning = "Cuidado, sesión por expirar";
            
            loginController.getLogin(req, res);
    
            expect(res.render).toHaveBeenCalledWith("auth/login.ejs", expect.objectContaining({
                warning: "Cuidado, sesión por expirar"
            }));
            // Esto cubre la línea 15 al entrar al if
            expect(req.session.warning).toBe("");
        });
    
        test('Debería retornar status 400 si getLogin falla (Línea 29)', () => {
            // Forzamos un error al acceder a req.session para que entre al catch
            // Borramos session para que req.session.info lance un TypeError
            delete req.session; 
    
            loginController.getLogin(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });
});