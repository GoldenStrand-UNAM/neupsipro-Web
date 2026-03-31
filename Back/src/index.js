const express = require("express");

const AuthService = require("./Infrastructure/Auth/AuthService");
const LogoutUseCase = require("./application/Usecase/LogoutUseCase");
const AuthController = require("./Presentation/Controller/AuthController");
const authRoutes = require("./Presentation/routes/authRoutes");

const app = express();
app.use(express.json());

const authService = new AuthService();
const logoutUseCase = new LogoutUseCase(authService);
const authController = new AuthController(logoutUseCase);

app.use("/auth", authRoutes(authController));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});