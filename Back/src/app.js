
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();


//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../../Front/public')));

//EJS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../Front/views'));

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