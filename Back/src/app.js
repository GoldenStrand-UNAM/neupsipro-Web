const express = require("express");
const cookieParser = require('cookie-parser');
const path = require("path");
const cors = require("cors");


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'Front', 'views'));
app.use(express.static(path.join(__dirname, '..', '..', 'Front', 'public')));
app.use(cors());
app.use(express.json());

const forumRoutes = require("./presentation/routes/forumRoutes");
const AuthService = require("./Infrastructure/Auth/AuthService");
const LogoutUseCase = require("./application/Usecase/LogoutUseCase");
const AuthController = require("./Presentation/Controller/AuthController");
const authRoutes = require("./Presentation/routes/authRoutes");
const dbPool = require("./infrastructure/database/database");
const AuthRepository = require("./infrastructure/repositories/authRepository")



const authService = new AuthService();
const logoutUseCase = new LogoutUseCase(authService);
const authController = new AuthController(logoutUseCase);
const authRepository = new AuthRepository(dbPool);


app.use("/forum", forumRoutes());
app.use("/auth", authRoutes(authController));


module.exports = app;