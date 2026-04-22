const express = require('express');
const path = require("path");
const cors = require("cors");
const { generalLimiter } = require('./infrastructure/external/rateLimiting');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'Front', 'views'));
app.use(express.static(path.join(__dirname, '..', '..', 'Front', 'public')));
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.json());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../Front/views'));
app.use(generalLimiter);

//Routes
app.use((req, res, next) => {
    res.locals.activePage = '';
    next();
});

app.use("/auth", authRoutes(logoutController, loginController));
app.use("/", homeRoutes(authMiddleware));
//app.use("/forum", forumRoutes());

app.get('/test', authMiddleware.verifyToken, (req, res) => {
    res.render('test');
});

app.use((req, res) => { 
    res.status(404).json({ error: 'Ruta no encontrada' }); 
});

module.exports = app;
