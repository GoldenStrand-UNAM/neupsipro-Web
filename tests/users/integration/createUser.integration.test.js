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

jest.mock('../../../Back/src/infrastructure/external/rateLimiting',() =>
    (_req,_res,next)=>next()
);

const mockExecute = jest.fn();

jest.mock('../../../Back/src/application/usecase/users/postUserUseCase',() =>
    jest.fn().mockImplementation(() => ({
     execute:mockExecute
    }))
);

const app = require('../../../Back/src/app');

afterAll(async()=>{await app.close?.();});

const validBody = () => ({
  userName:'juan123',
  firstName:'Juan',
  lastnameP:'Perez',
  birthdate:'01/01/2000',
  password:'123456',
  assigned:'clinic-001',
  phase:'Protésico',
  basePathology:'Diabetes',
  modality:'Presencial',
  referenceNumber:'REF001',
  amputationDate:'01/01/2023',
  amputationLevel:'Rodilla',
  laterality:'Diestra',
  prosthetist:'Carlos',
  pairs:'Sí asiste',
  sex:'Masculino'
});

test('renders post user form',async()=>{

    const res =await request(app).get('/user/post');

    expect(res.status).toBe(200);
});

describe('INTEGRATION — POST /user/post',()=>{

    beforeEach(()=>{

        jest.clearAllMocks();

        mockAuthBehavior ='authenticated';
    });

    test('creates user successfully', async()=>{

        mockExecute.mockResolvedValue({idUser:'u-001'});

        const res = await request(app).post('/user/post').send(validBody());

        expect(res.status).toBe(201);

        expect(mockExecute).toHaveBeenCalled();
    });

    test('returns 400 when usecase throws', async()=>{

        mockExecute.mockRejectedValue(new Error( 'Usuario duplicado'));

        const res = await request(app).post('/user/post').send(validBody());

        expect(res.status).toBe(400);

        expect(res.body.error).toContain('Usuario duplicado');
    });

    test('redirects to login if session expired', async()=>{

        mockAuthBehavior = 'unauthenticated';

        const res = await request(app).post('/user/post').send(validBody());

        expect(res.status).toBe(302);

        expect(res.header.location).toBe('/auth/');
    });
    
});