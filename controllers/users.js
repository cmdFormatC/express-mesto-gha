const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { handleErrorConstructor, handleDbErrors } = require('../utils/handleErrorTools');

const { JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => next(handleDbErrors(err, 'Некорректный запрос')));
};

const sendUserById = async (res, id) => {
  const user = await User.findById(id);
  if (!user) {
    return handleErrorConstructor(404, 'Пользователь по указанному _id не найден.');
  }
  res.send({ data: user });
};

const getCurrentUser = async (req, res, next) => {
  try {
    sendUserById(res, jwt.decode(req.cookies.jwt));
  } catch (err) {
    next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const getUserById = async (req, res, next) => {
  try {
    sendUserById(req, res, req.params._id);
  } catch (err) {
    next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .end();
    })
    .catch(err => {
      // eslint-disable-next-line no-param-reassign
      err.statusCode = 404;
      next(err);
    });
};
const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(
      {
        name, about, avatar, email, password: hashedPassword,
      },
    );
    res.status(201).send({ data: user });
  } catch (err) {
    if (err.code === 11000) {
      next(handleErrorConstructor(409, 'Указаный email уже зарегистрирован'));
    }
    next(handleDbErrors(err, 'Переданы некорректные данные при создании пользователя'));
  }
};

const updateUserProfile = async (req, res, next) => {
  const update = {};
  if (req.body.name) update.name = req.body.name;
  if (req.body.about) update.about = req.body.about;

  if (Object.keys(update).length === 0) {
    next(handleErrorConstructor(400, 'Переданы некорректные данные при обновлении профиля'));
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params._id,
      update,
      { new: true, runValidators: true },
    );
    if (!user) {
      return handleErrorConstructor(404, 'Пользователь по указанному _id не найден.');
    }
    res.send({ data: user });
  } catch (err) {
    next(handleDbErrors(err, 'Переданы некорректные данные при обновлении профиля'));
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params._id,
      { avatar: req.body.avatar },
      { new: true },
    );

    if (!user) {
      return handleErrorConstructor(404, 'Пользователь по указанному _id не найден.');
    }
    res.send({ data: user });
  } catch (err) {
    next(handleDbErrors(err, 'Переданы некорректные данные при обновлении аватара'));
  }
};

module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUserProfile,
  updateUserAvatar,
  login,
  getCurrentUser,
};
