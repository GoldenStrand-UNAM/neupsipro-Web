const express = require('express');
const cors = require('cors');
require('dotenv').config();

const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'presentation/views')));


app.use(express.static(path.join(__dirname, '../../Front/public')));

//EJS 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../Front/views'));

//Routes
app.use((req, res, next) => {
    res.locals.activePage = '';
    next();
});

// Routes
const registerPublicationRoutes = require('./presentation/routes/forum/postPublication.Routes');
app.use('/', registerPublicationRoutes);

const forumRoutes = require('./presentation/routes/forum/getForum.routes');
app.use('/', forumRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
