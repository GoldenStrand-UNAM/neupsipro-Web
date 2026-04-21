const express = require('express');
const path = require("path");
const cors = require("cors");


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'Front', 'views'));
app.use(express.static(path.join(__dirname, '..', '..', 'Front', 'public')));
app.use(cors());
app.use(express.json());

const publicationRoutes = require('./presentation/routes/forum/getPublication.routes');

app.use('/publication', publicationRoutes);


module.exports = app;

