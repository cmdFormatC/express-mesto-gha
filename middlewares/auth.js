const jwt = require('jsonwebtoken');

const { handleErrorConstructor } = require('../utils/handleErrorTools');

const { JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(handleErrorConstructor(401, 'Токен авторизации отсутсвует или не действителен'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(handleErrorConstructor(401, 'Токен авторизации отсутсвует или не действителен'));
  }

  req.user = payload;

  next();
};
