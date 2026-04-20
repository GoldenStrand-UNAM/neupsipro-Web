
const express = require('express');
const path = require("path");
const cors = require("cors");
const { generalLimiter } = require('./infrastructure/external/rateLimiting');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'Front', 'views'));
app.use(express.static(path.join(__dirname, '..', '..', 'Front', 'public')));
app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../Front/views'));
app.use(generalLimiter);

//Routes
app.use((req, res, next) => {
    res.locals.activePage = '';
    next();
});

const forumRoutes = require('./presentation/routes/forum/getForum.Routes');
app.use('/', forumRoutes);
const usersRoutes = require('./presentation/routes/users/getUsersList.Routes');
app.use('/', usersRoutes);



module.exports = app;


