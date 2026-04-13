const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');


require('dotenv').config();


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

const forumRoutes = require('./presentation/routes/forum/getForum.routes');
app.use('/', forumRoutes);
const usersRoutes = require('./presentation/routes/users/GetUsersList.Routes');
app.use('/', usersRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});