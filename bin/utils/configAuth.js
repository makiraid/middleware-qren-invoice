require('dotenv').config();
const confidence = require('confidence');

const config = {
    basicAuthApi: {
		username: process.env.USERNAME_BASICAUTH,
		password: process.env.PASSWORD_BASICAUTH,
    },
    qren: {
        base_url: process.env.URL_QREN,
        basic: process.env.QREN_BASIC_AUTH
    }
};

const store = new confidence.Store(config);
exports.get = key => store.get(key);
