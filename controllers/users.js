const User = require('../models/user');
const { handleError } = require('../utils/handleError');

const getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users }))
    .catch(err => handleError(err, res, { badRequestErrorText: 'Некорректный запрос', internalServerErrorText: 'Ошибка на сервере' }));
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params._id);
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    }
    res.send({ data: user });
  } catch (err) {
    handleError(err, res, { badRequestErrorText: 'Некорректный запрос', internalServerErrorText: 'Ошибка на сервере' });
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    res.status(201).send({ data: user });
  } catch (err) {
    handleError(err, res, { badRequestErrorText: 'Переданы некорректные данные при создании пользователя', internalServerErrorText: 'Ошибка на сервере' });
  }
};

const updateUserProfile = async (req, res) => {
  const update = {};
  if (req.body.name) update.name = req.body.name;
  if (req.body.about) update.about = req.body.about;

  if (Object.keys(update).length === 0) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params._id,
      update,
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    }
    res.send({ data: user });
  } catch (err) {
    handleError(err, res, { badRequestErrorText: 'Переданы некорректные данные при обновлении профиля', internalServerErrorText: 'Ошибка на сервере' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params._id,
      { avatar: req.body.avatar },
      { new: true },
    );

    if (!user) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден. ' });
    }
    res.send({ data: user });
  } catch (err) {
    handleError(err, res, {
      badRequestErrorText: 'Переданы некорректные данные при обновлении аватара',
      internalServerErrorText: 'Ошибка на сервере',
    });
  }
};

module.exports = {
  getUserById,
  getUsers,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
