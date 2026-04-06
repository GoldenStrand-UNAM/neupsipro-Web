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

//Routes

const forumRoutes = require('./presentation/routes/forum/getForum.routes');
app.use('/', forumRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front/public/views/base-page.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});