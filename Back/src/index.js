const path = require('path');
const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });
const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[${process.env.NODE_ENV || 'dev'}] Server running on port ${PORT}`);
});