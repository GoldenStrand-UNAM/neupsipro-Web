
const path = require('path');
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

const app = require('./app');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[${process.env.NODE_ENV || 'development'}] Servidor corriendo en puerto ${port}`);
});
