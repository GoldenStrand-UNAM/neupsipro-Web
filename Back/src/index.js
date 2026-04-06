const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
 
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../Front/public')));
 
// Routes
const usuarioRoutes = require('./presentation/routes/users/GetUsersList.Routes');
app.use('/', usuarioRoutes);
 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'presentation/views/GetUsers.html'));
});
 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
 