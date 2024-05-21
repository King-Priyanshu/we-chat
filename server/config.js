const dotenv = require('dotenv')

dotenv.config();

const config = {
    clientURL: process.env.CLIENT_URL
}

module.exports = config;