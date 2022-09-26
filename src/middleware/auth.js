const jwt = require('jsonwebtoken');
const User = require('../models/users.model');
require('dotenv').config();

const config = process.env.TOKEN_KEY;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(403).send('Please authenticate');
  }
  try {
    jwt.verify(token, config, (err, payload) => {
      if (err) {
        return res.status(403).send('Please authenticate');
      }
      const { _id } = payload;

      User.findById(_id).then((userData) => {
        req.user = userData;
        return next();
      });
    });
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};

module.exports = verifyToken;
