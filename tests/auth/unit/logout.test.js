const request = require('supertest');
const app = require('../../../Back/src/app');

// Check logout endpoint
describe('POST /auth/logout', () => {
  test('without token redirects to login', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', '');
    expect([200, 302]).toContain(res.status);
    if (res.status === 302) {
        //Redirects to login page
      expect(res.headers['location']).toMatch(/\/auth\//);
    }
  });

  test('with valid token clears jwt cookie', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', 'jwt_token=fake.jwt.token');

    expect([200, 302]).toContain(res.status);

    const cookies = res.headers['set-cookie'] || [];
    const jwtCookie = cookies.find(c => c.startsWith('jwt_token'));
    expect(jwtCookie).toBeDefined();
    expect(jwtCookie).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/);
  });
});

// Token blacklisted after logout
describe('Session in multiple tabs', () => {
  test('logout invalidates token across all tabs', async () => {
    const sharedToken = 'jwt_token=shared.jwt.token';

    await request(app)
      .post('/auth/logout')
      .set('Cookie', sharedToken);

    const res = await request(app)
      .get('/dashboard')
      .set('Cookie', sharedToken);

    expect([302, 401, 403]).toContain(res.status);
  });
});

