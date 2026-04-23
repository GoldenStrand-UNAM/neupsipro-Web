const path = require('path');
const dotenv = require('dotenv');

// Combine merges from 0.1.0 with test and prod env
let envFile = 'env';
if (process.env.NODE_ENV === 'test') {
    envFile = '.env.test';
} else if (process.env.NODE_ENV === 'production') {
    envFile = '.env.production';
}

dotenv.config({ path: path.resolve(__dirname, envFile) });

const app = require("./app");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[${process.env.NODE_ENV || 'dev'}] Server running on port ${PORT}`);
});
