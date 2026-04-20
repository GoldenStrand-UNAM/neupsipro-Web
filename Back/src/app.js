const express = require('express');
const path = require("path");
const cors = require("cors");


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'Front', 'views'));
app.use(express.static(path.join(__dirname, '..', '..', 'Front', 'public')));
app.use(cors());
app.use(express.json());

const usersRoutes = require('./presentation/routes/users/getUser.Routes');
app.use('/users', usersRoutes);

app.get('/consultUser', (req, res) => {
    res.render('users/consultUser', {
        activePage: 'usuario',
        
    });
});

module.exports = app;

