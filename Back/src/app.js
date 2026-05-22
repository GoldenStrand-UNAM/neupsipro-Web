const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { loginLimiter, generalLimiter, apiLimiter, publicationLimiter } = require('./infrastructure/external/rateLimiting');
const { doubleCsrf } = require('csrf-csrf');
const helmet = require('helmet');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../../front/views'));
app.use(express.static(path.join(__dirname, '..', '..', 'front', 'public')));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet({
  //TODO: remove once we have HTTPS certificate
  hsts: false,
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'upgrade-insecure-requests': null,

      'default-src': ["'self'"],

      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
      'style-src-elem': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],

      'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],

      'img-src': ["'self'", 'data:', 'blob:', 'https://s3-neupsi-golden-unam-preprod-1.s3.us-east-1.amazonaws.com'],

      'script-src': [
        "'self'",
        'https://cdn.jsdelivr.net',
        "'unsafe-inline'",
      ],
      'script-src-attr': ["'unsafe-inline'"],
    },
  },
}));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

//APP LIMITER
if (loginLimiter) app.post('/auth/login', loginLimiter);
if (generalLimiter) app.use(generalLimiter);

const AuthService = require('./infrastructure/auth/authService');
const LoginUseCase = require('./application/usecase/auth/loginUseCase');
const LogoutUseCase = require('./application/usecase/auth/logoutUseCase');
const AuthorizationUseCase = require('./application/usecase/auth/authorizationUseCase');
const LoginController = require('./presentation/controller/auth/login.controller');
const LogoutController = require('./presentation/controller/auth/logout.controller');
const authRoutes = require('./presentation/routes/auth/auth.routes');

app.use (session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: true,
}));

const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'cambia-esto-en-desarrollo',
  getSessionIdentifier: (req) => req.session.id,
  cookieName: 'x-csrf-token',
  cookieOptions: { httpOnly: true, sameSite: 'lax', secure: false },
  getCsrfTokenFromRequest: (req) => req.body?.['x-csrf-token'] || req.headers['x-csrf-token'],
});

// Middleware to either apply or skip csrf
app.use((req, res, next) => {
  const hasBearer = req.headers.authorization?.startsWith('Bearer ');

  // Use include to ignore charset
  const isJsonBody = req.headers['content-type']?.includes('application/json');
  const wantsJson = req.headers.accept?.includes('application/json');
  const isAndroidOrApi = hasBearer || isJsonBody || wantsJson;

  //If any of the three above is true, means it is android request
  if (isAndroidOrApi) {
    return next();
  }

  // If web, validate csrf
  if (process.env.NODE_ENV !== 'test') {
    return doubleCsrfProtection(req, res, next);
  }
  next();
});

// Middleware to generate csfr for web
app.use((req, res, next) => {
  const hasBearer = req.headers.authorization?.startsWith('Bearer ');
  const isJsonBody = req.headers['content-type']?.includes('application/json');
  const wantsJson = req.headers.accept?.includes('application/json');
  const isAndroidOrApi = hasBearer || isJsonBody || wantsJson;

  // If mobile, does not generate csrf
  if (isAndroidOrApi) {
    res.locals.csrfToken = null;
    return next();
  }

  // Generate only if it is web
  try {
    res.locals.csrfToken = generateCsrfToken(req, res);
  } catch (error) {
    res.locals.csrfToken = '';
  }
  next();
});

app.use((req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    res.locals.csrfToken = null;
    return next();
  }

  res.locals.csrfToken = generateCsrfToken(req, res);
  next();
});

app.get('/auth/token', (req, res) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

const dbPool = require('./infrastructure/database/database');
const AuthRepository = require('./infrastructure/repositories/ImpLoginRepository');
const SessionRepository = require('./infrastructure/repositories/ImpSessionRepository');
const HashingService = require('./infrastructure/external/hashing.service');
const JwtService = require('./infrastructure/external/jwt.service');
const CacheService = require('./infrastructure/external/memoryCache.service');

const AuthMiddleware = require('./infrastructure/auth/auth.middleware');

const jwtService = new JwtService();
const hashingService = new HashingService();
const cacheService = new CacheService();
const authService = new AuthService();
const authRepository = new AuthRepository(dbPool);
const sessionRepository = new SessionRepository(dbPool);

const authMiddleware = new AuthMiddleware(jwtService, authService);

const loginUseCase = new LoginUseCase(authRepository, hashingService, jwtService, cacheService, sessionRepository);
const logoutUseCase = new LogoutUseCase(authRepository);
const authUseCase = new AuthorizationUseCase(authRepository);

const loginController = new LoginController(loginUseCase);
const logoutController = new LogoutController(logoutUseCase, jwtService);

app.use('/auth', authRoutes(logoutController, loginController));

//================ Routes =======================
app.use((req, res, next) => {
  res.locals.activePage = '';
  next();
});

// Dasboards
const dashRoutes = require('./presentation/routes/dashboard/getClinicalUserDashboard.routes');

app.use('/dashboardClinical', dashRoutes(authUseCase));

// Forum
const forumRoutes = require('./presentation/routes/forum/getForum.routes');

app.use('/forum', forumRoutes(authUseCase));

const publicationRoutes = require('./presentation/routes/forum/getPublication.routes');

app.use('/publication', publicationRoutes(authUseCase));

const usersRoutes = require('./presentation/routes/users/getUsersList.routes');

app.use('/', usersRoutes(authUseCase));

const userRoutes = require('./presentation/routes/users/getUser.routes');

app.use('/users', userRoutes(authUseCase));

const clinicalUserRoutes = require('./presentation/routes/clinical/getClinicalUser.routes');

app.use('/clinical', clinicalUserRoutes(authUseCase));

const clinicalRoutes = require('./presentation/routes/clinical/getUsersListClinical.routes');

app.use('/', clinicalRoutes(authUseCase));

const postPublicationRoutes = require('./presentation/routes/forum/postPublication.routes');

app.use('/', postPublicationRoutes(authUseCase));

const dashboardRoutes = require('./presentation/routes/dashboard/dashboardUnit.routes');

app.use('/', dashboardRoutes(authUseCase));

const getAllClinicalsRoutes   = require('./presentation/routes/clinical/getAllClinicals.routes');

app.use('/', getAllClinicalsRoutes(authUseCase));

app.get('/test', authMiddleware.verifyToken, (req, res) => {
  res.render('test');
});

const profileRoutes = require('./presentation/routes/users/profile.routes');

app.use('/api/profile', profileRoutes(authUseCase));

app.get('/consultUser', (req, res) => {
  res.render('users/consultUser', {
    activePage: 'usuario',
  });
});

app.get('/construction', (req, res) => {
  res.render('construction');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});
module.exports = app;
