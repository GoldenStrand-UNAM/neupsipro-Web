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

app.use (session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false, 
  }));


app.get('/test', (req, res) => {
    res.render('test');
});

const forumRoutes = require("./presentation/routes/forumRoutes");
const AuthService = require("./Infrastructure/Auth/AuthService");
const LogoutUseCase = require("./application/usecase/LogoutUseCase");
const LoginUseCase = require("./application/usecase/LoginUseCase");
const AuthController = require("./Presentation/Controller/AuthController");
const authRoutes = require("./Presentation/routes/authRoutes");
const dbPool = require("./infrastructure/database/database");
const AuthRepository = require("./infrastructure/repositories/authRepository");
const HashingService = require("./infrastructure/external/hashing.service");
const JwtService = require("./infrastructure/external/jwt.service");
const CacheService = require("./infrastructure/external/memoryCache.service");

const jwtService = new JwtService();
const hashingService = new HashingService();
const cacheService = new CacheService();
const authService = new AuthService();
const authRepository = new AuthRepository(dbPool);


const logoutUseCase = new LogoutUseCase(authService);
const loginUseCase = new LoginUseCase(authRepository, hashingService, jwtService, cacheService);

const authController = new AuthController(logoutUseCase, loginUseCase);


app.use("/forum", forumRoutes());
app.use("/auth", authRoutes(authController));

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