require("dotenv").config();

const app = require ('./app.js');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
