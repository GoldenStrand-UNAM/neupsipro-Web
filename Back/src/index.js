const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'presentation/views')));

// Routes
const registerPublicationRoutes = require('./presentation/routes/forum/postPublication.Routes');
app.use('/', registerPublicationRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'presentation/views/register-publication.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
