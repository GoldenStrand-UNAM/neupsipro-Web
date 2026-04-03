const express = require("express");
const cors = require("cors");

const AuthService = require("./Infrastructure/Auth/AuthService");
const LogoutUseCase = require("./application/Usecase/LogoutUseCase");
const AuthController = require("./Presentation/Controller/AuthController");
const authRoutes = require("./Presentation/routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const authService = new AuthService();
const logoutUseCase = new LogoutUseCase(authService);
const authController = new AuthController(logoutUseCase);

app.use("/auth", authRoutes(authController));

app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("Server running on http://localhost:3000");
});