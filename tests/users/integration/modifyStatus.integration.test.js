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

jest.mock('../../../Back/src/application/usecase/users/modifystateUseCase',() =>
    jest.fn().mockImplementation(() => ({
     execute:mockExecute
    }))
);

const app = require('../../../Back/src/app');

afterAll(async()=>{await app.close?.();});

test('shows modal without errors', async()=>{

    const res =await request(app).get('/user/post');

    expect(res.status).toBe(200);
})

