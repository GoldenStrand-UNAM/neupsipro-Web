const express = require('express');
const cors    = require('cors');
const path    = require('path');
const app     = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../../Front/public')));

const usersRoutes = require('./presentation/routes/users/GetUsersList.Routes');
app.use('/', usersRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Front/public/views/usuarios.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));