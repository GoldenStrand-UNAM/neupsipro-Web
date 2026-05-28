const request = require('supertest');

let mockAuthBehavior = 'authenticated';

jest.mock('../../../Back/src/infrastructure/auth/auth.middleware',() =>
jest.fn(() => ({verifyToken: (req,res,next)=>{

    if(mockAuthBehavior === 'unauthenticated'){
      return res.redirect('/auth/');
    }
    req.user = { id:1, role:'admin'};

    next();
  }
}))
);

jest.mock('../../../Back/src/infrastructure/auth/permissions.middleware',() =>
jest.fn(() => ({requirePermission:()=>
  (req,res,next)=>next()
}))
);

jest.mock('../../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter:      (req, res, next) => next(),
  generalLimiter:    (req, res, next) => next(),
  apiLimiter:        (req, res, next) => next(),
  publicationLimiter:(req, res, next) => next(),
  userLimiter:       (req, res, next) => next(),
}));

const mockExecute = jest.fn();

jest.mock('../../../Back/src/application/usecase/users/modifyStateUseCase',() =>
    jest.fn().mockImplementation(() => ({
     execute:mockExecute
    }))
);

const app = require('../../../Back/src/app');

afterAll(async()=>{await app.close?.();});

describe('INTEGRATION - PATCH users/:id_user/state', () => {

  beforeEach(()=>{

        jest.clearAllMocks();

        mockAuthBehavior ='authenticated';
  });

  test('modifies status successfuly', async() => {
    mockExecute.mockResolvedValue({state: "Stand_by"});
    const state = {id:"u-001", state: "Stand_by"};
    const res = await request(app).patch('/users/u-001/state').send(state);
    expect(res.status).toBe(200);
    expect(mockExecute).toHaveBeenCalled();
  })

  test('returns 400 when usecase throws', async()=>{
    mockExecute.mockRejectedValue(new Error( 'No se pudo actualizar el estatus del usuario'));
    const state = {id:"u-001", state: "Stand_by_NO"};
    const res = await request(app).patch('/users/u-001/state').send(state);
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('No se pudo actualizar el estatus del usuario');
    });

  test('unauthenticated user', async() => {
    mockAuthBehavior = 'unauthenticated';
    const state = {id_user:"u-001", state: "Stand_by"};
    const res = await request(app).patch('/users/u-001/state').send(state);
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/auth/');
  })

})
