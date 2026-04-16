const express = require('express');
const path = require("path");
const cors = require("cors");


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', '..', 'Front', 'src', 'views'));
app.use(express.static(path.join(__dirname, '..', '..', 'Front', 'public')));

app.use(cors());
app.use(express.json());

// Routes
const forumRoutes = require('./presentation/routes/forum/getForum.routes');
app.use('/forum', forumRoutes);


module.exports = app;

