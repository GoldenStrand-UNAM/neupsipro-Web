const request = require('supertest');
const app = require('../Back/src/app');
require('../Back/src/infrastructure/repositories/usersRepository')

const mockFetchActiveUsers = jest.fn();
const mockCountActiveUsers = jest.fn();


jest.mock("../../../infrastructure/repositories/usersRepository", () => {

  return jest.fn().mockImplementation(() => ({
    fetchActiveUsers: mockFetchActiveUsers,
    countActiveUsers: mockCountActiveUsers,
  }));
  
});


describe('GET /usuarios', () => {

    test('retorna status 200', async () => {
        const response = await request(app).get('/usuarios');
        expect(response.status).toBe(200);
    });


});

