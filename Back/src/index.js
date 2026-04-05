const express = require('express');
const app = express();
require('dotenv').config();

const path = require('path');


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Routes

const forumRoutes = require('./presentation/routes/forum/getForum.routes');
app.use('/forum', forumRoutes);


const PORT = 3306;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});