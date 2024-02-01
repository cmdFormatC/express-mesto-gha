const Card = require('../models/cards');

const { handleErrorConstructor, handleDbErrors } = require('../utils/handleErrorTools');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndRemove(req.params._cardId);
    if (!card) {
      return handleErrorConstructor(404, 'Карточка не найдена');
    }
    res.send({ data: card });
  } catch (err) {
    next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;

  if (!name || !link) {
    return handleErrorConstructor(400, 'Некорректные данные');
  }

  try {
    const card = await Card.create({ name, link });
    res.send({ data: card });
  } catch (err) {
    next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return handleErrorConstructor(404, 'Карточка не найдена');
    }

    res.send({ data: card });
  } catch (err) {
    next(handleDbErrors(err, 'Некорректный запрос'));
  }
};
const deleteLikeFromCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return handleErrorConstructor(404, 'Карточка не найдена');
    }

    res.send({ data: card });
  } catch (err) {
    next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  deleteLikeFromCard,
};
