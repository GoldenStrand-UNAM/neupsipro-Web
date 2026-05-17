const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { loginLimiter, generalLimiter } = require('./infrastructure/external/rateLimiting');
//const { doubleCsrf } = require('csrf-csrf');
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
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),

      'default-src': ["'self'"],

      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'style-src-elem': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],

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

const AuthService = require("./infrastructure/auth/AuthService");
const LoginUseCase = require("./application/Usecase/auth/loginUseCase");
const LogoutUseCase = require("./application/Usecase/auth/logoutUseCase");
const AuthorizationUseCase = require("./application/Usecase/auth/authorizationUseCase");
const PostUserUseCase = require("./application/Usecase/users/postUserUseCase");
const LoginController = require("./presentation/controller/auth/login.controller");
const LogoutController = require("./presentation/controller/auth/logout.controller");
const authRoutes = require("./presentation/routes/auth/auth.routes");
app.use (session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: true,
}));

/*const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'cambia-esto-en-desarrollo',
  getSessionIdentifier: (req) => req.session.id,
  cookieName: 'x-csrf-token',
  cookieOptions: { httpOnly: true, sameSite: 'lax', secure: false },
  getCsrfTokenFromRequest: (req) => req.body['x-csrf-token'] || req.headers['x-csrf-token'],
});

app.use(doubleCsrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = generateCsrfToken(req, res);
  next();
});*/

const dbPool = require('./infrastructure/database/database');
const AuthRepository = require('./infrastructure/repositories/ImpLoginRepository');
const SessionRepository = require('./infrastructure/repositories/ImpSessionRepository');
const UserRepository = require("./infrastructure/repositories/ImpUsersRepository");
const HashingService = require('./infrastructure/external/hashing.service');
const JwtService = require('./infrastructure/external/jwt.service');
const CacheService = require('./infrastructure/external/memoryCache.service');

const homeRoutes = require('./presentation/routes/home/home.routes');
const AuthMiddleware = require('./infrastructure/auth/auth.middleware');

const jwtService = new JwtService();
const hashingService = new HashingService();
const cacheService = new CacheService();
const authService = new AuthService();
const authRepository = new AuthRepository(dbPool);
const sessionRepository = new SessionRepository(dbPool);
const userRepository = new UserRepository();

const authMiddleware = new AuthMiddleware(jwtService, authService);

const loginUseCase = new LoginUseCase(authRepository, hashingService, jwtService, cacheService, sessionRepository);
const logoutUseCase = new LogoutUseCase(authService);
const authUseCase = new AuthorizationUseCase(authRepository);
const postUserUseCase = new PostUserUseCase(userRepository, hashingService);

const loginController = new LoginController(loginUseCase);
const logoutController = new LogoutController(logoutUseCase);

app.use('/auth', authRoutes(logoutController, loginController));
app.use('/', homeRoutes(authUseCase));

//================ Routes =======================
app.use((req, res, next) => {
  res.locals.activePage = '';
  next();
});

app.use('/', homeRoutes(authMiddleware));

// Forum
const forumRoutes = require('./presentation/routes/forum/getForum.routes');

app.use('/forum', forumRoutes(authUseCase));

const publicationRoutes = require('./presentation/routes/forum/getPublication.routes');

app.use('/publication', publicationRoutes(authUseCase));

const usersRoutes = require('./presentation/routes/users/getUsersList.routes');

app.use('/', usersRoutes(authUseCase));

const userRoutes = require('./presentation/routes/users/getUser.Routes');

app.use('/users', userRoutes(authUseCase));

const clinicalUserRoutes = require('./presentation/routes/clinical/getClinicalUser.routes');

const postUserRoutes = require('./presentation/routes/users/postUser.routes');
app.use('/', postUserRoutes(authUseCase));

app.use('/clinical', clinicalUserRoutes(authUseCase));

const clinicalRoutes = require('./presentation/routes/clinical/getUsersListClinical.Routes');

app.use('/', clinicalRoutes(authUseCase));

const postPublicationRoutes = require('./presentation/routes/forum/postPublication.Routes');

app.use('/', postPublicationRoutes(authUseCase));

const dashboardRoutes = require('./presentation/routes/dashboard/dashboardUnit.routes');

app.use('/', dashboardRoutes(authUseCase));

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
