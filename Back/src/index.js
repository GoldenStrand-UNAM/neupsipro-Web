require("dotenv").config();

const app = require ('./app.js');


app.get('/test', (req, res) => {
    res.render('test');
});

app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("Server running on http://localhost:3000");
});