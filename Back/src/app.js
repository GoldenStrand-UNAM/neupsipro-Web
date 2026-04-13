const express = require("express");
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require("cors");
const session = require("express-session")


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'Front', 'views'));
app.use(express.static(path.join(__dirname, '..', '..', 'Front', 'public')));
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use (session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false, 
  }));


app.get('/test', (req, res) => {
    res.render('test');
});

const forumRoutes = require("./presentation/routes/forum.routes");
const AuthService = require("./Infrastructure/Auth/AuthService");
const LogoutUseCase = require("./application/usecase/auth/logoutUseCase");
const LoginUseCase = require("./application/usecase/auth/loginUseCase");
const LogoutController = require("./presentation/controller/auth/logout.controller");
const LoginController = require("./presentation/controller/auth/login.controller");
const authRoutes = require("./presentation/routes/auth/auth.routes");
const dbPool = require("./infrastructure/database/database");
const AuthRepository = require("./infrastructure/repositories/authRepository");
const HashingService = require("./infrastructure/external/hashing.service");
const JwtService = require("./infrastructure/external/jwt.service");
const CacheService = require("./infrastructure/external/memoryCache.service");
const homeRoutes = require("./presentation/routes/home/home.routes")

const jwtService = new JwtService();
const hashingService = new HashingService();
const cacheService = new CacheService();
const authService = new AuthService();
const authRepository = new AuthRepository(dbPool);


const logoutUseCase = new LogoutUseCase(authService);
const loginUseCase = new LoginUseCase(authRepository, hashingService, jwtService, cacheService);

const logoutController = new LogoutController(logoutUseCase);
const loginController = new LoginController(loginUseCase);


app.use("/forum", forumRoutes());
app.use("/auth", authRoutes(logoutController, loginController));
app.use("/", homeRoutes());

//Routes
app.use((req, res, next) => {
    res.locals.activePage = '';
    next();
});

// Routes
const registerPublicationRoutes = require('./presentation/routes/forum/postPublication.Routes');
app.use('/', registerPublicationRoutes);

const getForumRoutes = require('./presentation/routes/forum/getForum.routes');
app.use('/', getForumRoutes);


module.exports = app;