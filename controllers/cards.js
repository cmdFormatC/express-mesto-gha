const Card = require('../models/cards');
const { handleError } = require('../utils/handleError');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    handleError(err, res, { badRequestErrorText: 'Некорректный запрос', internalServerErrorText: 'Ошибка на сервере' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params._cardId);
    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }
    res.send({ data: card });
  } catch (err) {
    handleError(err, res, { badRequestErrorText: 'Некорректный запрос', internalServerErrorText: 'Ошибка на сервере' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return res.status(400).send({ message: 'Некорректные данные' });
  }

  try {
    const card = await Card.create({ name, link });
    res.send({ data: card });
  } catch (err) {
    handleError(err, res, { badRequestErrorText: 'Некорректный запрос', internalServerErrorText: 'Ошибка на сервере' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    res.send({ data: card });
  } catch (err) {
    handleError(err, res, { badRequestErrorText: 'Некорректный запрос', internalServerErrorText: 'Ошибка на сервере' });
  }
};
const deleteLikeFromCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    res.send({ data: card });
  } catch (err) {
    handleError(err, res, { badRequestErrorText: 'Некорректный запрос', internalServerErrorText: 'Ошибка на сервере' });
  }
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  deleteLikeFromCard,
};
