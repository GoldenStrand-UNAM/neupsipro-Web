require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '../../Front/public')));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../Front/src/views'));

// Middleware global
app.use((req, res, next) => {
    res.locals.activePage = '';
    next();
});

// Routes
const forumRoutes = require('./presentation/routes/forum/getForum.routes');
app.use('/', forumRoutes);

module.exports = app;