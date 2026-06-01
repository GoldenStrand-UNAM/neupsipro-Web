
jest.mock('../../Back/src/infrastructure/external/s3.config', () => ({
    uploadToS3: jest.fn()
}));

jest.mock('../../Back/src/infrastructure/auth/auth.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    verifyToken: (req, res, next) => {
      req.user = { userId: 1, role: 'admin' };
      next();
    }
  }));
});

jest.mock('../../Back/src/infrastructure/auth/permissions.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    requirePermission: () => (req, res, next) => next()
  }));
});

jest.mock('../../Back/src/infrastructure/external/rateLimiting', () => ({
  loginLimiter:      (req, res, next) => next(),
  generalLimiter:    (req, res, next) => next(),
  apiLimiter:        (req, res, next) => next(),
  publicationLimiter:(req, res, next) => next(),
  userLimiter:       (req, res, next) => next(),
}));

jest.mock('../../Back/src/infrastructure/repositories/ImpForumRepository',() => {
    return jest.fn().mockImplementation(() => ({
        save: jest.fn().mockResolvedValue({
            id_publication: '123',
            title: 'publicationFakeTitle',
            content: 'contentFake',
            time_and_date: '2026-05-01 19:02:04',
            image: 'https://my-bucket.s3.amazonaws.com/images/foto.jpg'
            })
    }));
});

const request = require('supertest');
const app = require('../../Back/src/app');
let ForumRepository;
const s3Service = require('../../Back/src/infrastructure/external/s3.config');
const { escape } = require('../../Back/src/infrastructure/database/database');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../../front/public/uploads');

const clearUploads = () => {
    if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        for (const file of files) {
            if (file !== '.gitkeep') {
                fs.unlinkSync(path.join(uploadsDir, file));
            }
        }
    }
};

const mockedS3Upload = s3Service.uploadToS3;

describe('POST /upload (with mocked s3 service) SUCCESS', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.isolateModules(() => {
        ForumRepository = require('../../Back/src/infrastructure/repositories/ImpForumRepository');
    });
    });

    test('Successfully opens upload publication page', async () => {
        const res = await request(app).get('/forum/post');
        expect(res.status).toBe(200);
    });

    test('Successfully uploads an image', async () => {
        const fakeImage = "https://my-bucket.s3.amazonaws.com/images/foto.jpg";

        mockedS3Upload.mockResolvedValue(fakeImage);
        
        const imagePath = path.join(__dirname, '../fixtures/testImage.jpg');
        const imageBuffer = fs.readFileSync(imagePath);

        const res = await request(app)
        .post('/forum/post')
        .field('titulo','publicationFakeTitle')
        .field('contenido','contentFake')
        .attach('imagen', imageBuffer, 'testImage.jpg');

        expect(res.status).toBe(201);
        expect(mockedS3Upload).toHaveBeenCalledTimes(1);
        expect(res.body.image).toBe(fakeImage);
    });
})
describe('POST /upload (with mocked s3 service) ALTERNATE FLOWS', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.isolateModules(() => {
        ForumRepository = require('../../Back/src/infrastructure/repositories/ImpForumRepository');
    });
    });

    test('Tries uploading unkown file type', async () => {
        const fakeImage = "https://my-bucket.s3.amazonaws.com/images/foto.jpg";

        mockedS3Upload.mockResolvedValue(fakeImage);
        
        const imagePath = path.join(__dirname, '../fixtures/testImage.jpg');
        const imageBuffer = fs.readFileSync(imagePath);

        const res = await request(app)
        .post('/forum/post')
        .field('titulo','publicationFakeTitle')
        .field('contenido','contentFake')
        .attach('imagen', imageBuffer, 'testImage.exe');

        expect(res.status).toBe(500);
    });

    test('Tries uploading publication with no title', async () => {
        const fakeImage = "https://my-bucket.s3.amazonaws.com/images/foto.jpg";

        mockedS3Upload.mockResolvedValue(fakeImage);
        
        const imagePath = path.join(__dirname, '../fixtures/testImage.jpg');
        const imageBuffer = fs.readFileSync(imagePath);

        const res = await request(app)
        .post('/forum/post')
        .field('contenido','contentFake')
        .attach('imagen', imageBuffer, 'testImage.jpg');

        expect(res.status).toBe(422);
    });

    test('SQL inyection test in title', async () => {
        const fakeImage = "https://my-bucket.s3.amazonaws.com/images/foto.jpg";

        mockedS3Upload.mockResolvedValue(fakeImage);
        
        const imagePath = path.join(__dirname, '../fixtures/testImage.jpg');
        const imageBuffer = fs.readFileSync(imagePath);

        const res = await request(app)
        .post('/forum/post')
        .field('titulo',"' OR '1'='1")
        .field('contenido','contentFake')
        .attach('imagen', imageBuffer, 'testImage.jpg');

        expect(res.status).toBe(201);
        expect(mockedS3Upload).toHaveBeenCalledTimes(1);
        expect(res.body.image).toBe(fakeImage);
    });

    test('SQL inyection test in content', async () => {
        const fakeImage = "https://my-bucket.s3.amazonaws.com/images/foto.jpg";

        mockedS3Upload.mockResolvedValue(fakeImage);
        
        const imagePath = path.join(__dirname, '../fixtures/testImage.jpg');
        const imageBuffer = fs.readFileSync(imagePath);

        const res = await request(app)
        .post('/forum/post')
        .field('titulo','publicationFakeTitle')
        .field('contenido',"' OR '1'='1")
        .attach('imagen', imageBuffer, 'testImage.jpg');

        expect(res.status).toBe(201);
        expect(mockedS3Upload).toHaveBeenCalledTimes(1);
        expect(res.body.image).toBe(fakeImage);
    });

    test('Extremly large title', async () => {
        const fakeImage = "https://my-bucket.s3.amazonaws.com/images/foto.jpg";

        mockedS3Upload.mockResolvedValue(fakeImage);
        
        const imagePath = path.join(__dirname, '../fixtures/testImage.jpg');
        const imageBuffer = fs.readFileSync(imagePath);

        const longText = 'a'.repeat(10000000)

        const res = await request(app)
        .post('/forum/post')
        .field('titulo',longText)
        .field('contenido','contentFake')
        .attach('imagen', imageBuffer, 'testImage.jpg');

        expect(res.status).toBe(500);
    });

        test('Extremly large title', async () => {
        const fakeImage = "https://my-bucket.s3.amazonaws.com/images/foto.jpg";

        mockedS3Upload.mockResolvedValue(fakeImage);
        
        const imagePath = path.join(__dirname, '../fixtures/testImage.jpg');
        const imageBuffer = fs.readFileSync(imagePath);

        const longText = 'a'.repeat(100000000)

        const res = await request(app)
        .post('/forum/post')
        .field('titulo','FakeTitle')
        .field('contenido',longText)
        .attach('imagen', imageBuffer, 'testImage.jpg');

        expect(res.status).toBe(500);
    });
  })



afterEach(() => {
    clearUploads();
});