// Import des packages :
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'TOKEN_SECRET_PHRASE');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      res.status(403).json({ error: '403: unauthorized request' });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};
