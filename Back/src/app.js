const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const { loginLimiter, generalLimiter } = require('../../Back/src/Infrastructure/external/rateLimiting');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../../front/Views'));
app.use(express.static(path.join(__dirname, '..', '..', 'front', 'Public')));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

//APP LIMITER
app.post('/auth/login', loginLimiter);
app.use(generalLimiter);

const AuthService = require('./infrastructure/auth/AuthService');
const LoginUseCase = require('./application/Usecase/auth/loginUseCase');
const LogoutUseCase = require('./application/Usecase/auth/logoutUseCase');
const AuthorizationUseCase = require('./application/Usecase/auth/authorizationUseCase');
const LoginController = require('./presentation/controller/auth/login.controller');
const LogoutController = require('./presentation/controller/auth/logout.controller');
const authRoutes = require('./presentation/routes/auth/auth.routes');

app.use (session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
}));

const dbPool = require('./infrastructure/database/database');
const AuthRepository = require('./infrastructure/repositories/ImpLoginRepository');
const SessionRepository = require('./infrastructure/repositories/ImpSessionRepository');
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

const authMiddleware = new AuthMiddleware(jwtService, authService);

const loginUseCase = new LoginUseCase(authRepository, hashingService, jwtService, cacheService, sessionRepository);
const logoutUseCase = new LogoutUseCase(authService);
const authUseCase = new AuthorizationUseCase(authRepository);

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
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });

});

app.get('/consultUser', (req, res) => {
  res.render('users/consultUser', {
    activePage: 'usuario',
  });
});

module.exports = app;
