const config = require('./configAuth');

const basicAuth = async (req, res, next) => {
    const cfg = config.get('/basicAuthApi');
  
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
      return res.status(401).json({ message: 'Missing Authorization Header' });
    }
  
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    const user = await (username === cfg.username && password === cfg.password);
  
    if (!user) {
      return res.status(401).json({ message: 'Invalid Authentication Credentials' });
    }
  
    return next();
  };
  
module.exports = basicAuth;  
