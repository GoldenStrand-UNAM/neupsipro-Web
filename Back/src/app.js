const express = require("express");
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require("cors");
const session = require("express-session")
const { loginLimiter } = require('../../Back/src/Infrastructure/external/rateLimiting');


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../../front/Views'));
app.use(express.static(path.join(__dirname, '..', '..', 'front', 'Public')));

app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});
app.use('/auth/login', loginLimiter);

//const forumRoutes = require("./presentation/routes/forum.routes");
const AuthService = require("./infrastructure/auth/AuthService");
const LogoutUseCase = require("./application/usecase/auth/logoutUseCase");
const LoginUseCase = require("./application/Usecase/auth/loginUseCase");
const AuthorizationUseCase = require("./application/Usecase/auth/authorizationUseCase");
const LogoutController = require("./presentation/controller/auth/logout.controller");
const LoginController = require("./presentation/controller/auth/login.controller");
const authRoutes = require("./presentation/routes/auth/auth.routes");
app.use (session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false, 
    saveUninitialized: false, 
}));

const dbPool = require("./infrastructure/database/database");
const AuthRepository = require("./infrastructure/repositories/authRepository");
const SessionRepository = require("./infrastructure/repositories/sessionRepository");
const HashingService = require("./infrastructure/external/hashing.service");
const JwtService = require("./infrastructure/external/jwt.service");
const CacheService = require("./infrastructure/external/memoryCache.service");



const homeRoutes = require("./presentation/routes/home/home.routes");
//const registerPublicationRoutes = require('./presentation/routes/forum/postPublication.Routes');
//const getForumRoutes = require('./presentation/routes/forum/getForum.routes');
const AuthMiddleware = require("./infrastructure/auth/auth.middleware");

const jwtService = new JwtService();
const hashingService = new HashingService();
const cacheService = new CacheService();
const authService = new AuthService();
const authRepository = new AuthRepository(dbPool);
const sessionRepository = new SessionRepository(dbPool);

const authMiddleware = new AuthMiddleware(jwtService, authService);

const logoutUseCase = new LogoutUseCase(authService);
const loginUseCase = new LoginUseCase(authRepository, hashingService, jwtService, cacheService, sessionRepository);
const authUseCase = new AuthorizationUseCase(authRepository);

const logoutController = new LogoutController(logoutUseCase);
const loginController = new LoginController(loginUseCase);


//app.use("/forum", forumRoutes());
app.use("/auth", authRoutes(logoutController, loginController));
app.use("/", homeRoutes(authUseCase));

//Routes
app.use((req, res, next) => {
    res.locals.activePage = '';
    next();
});

//app.use("/forum", forumRoutes());
app.use("/auth", authRoutes(logoutController, loginController));
app.use("/", homeRoutes(authMiddleware));
//app.use('/', registerPublicationRoutes);
// app.use('/', getForumRoutes); <- Esto causa errores para el test de login .-.

app.get('/test', authMiddleware.verifyToken, (req, res) => {
    res.render('test');
});

app.use((req, res) => { 
    res.status(404).json({ error: 'Ruta no encontrada' }); 
});

module.exports = app;
