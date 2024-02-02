const Card = require('../models/cards');

const { handleErrorConstructor, handleDbErrors } = require('../utils/handleErrorTools');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return next(handleErrorConstructor(404, 'Карточка не найдена'));
    }

    if (req.user._id !== card.owner.toString()) {
      return next(handleErrorConstructor(403, 'Нельзя удалить не свою карточку'));
    }
    await Card.findByIdAndDelete(req.params.cardId);
    res.send({ data: card });
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  if (!name || !link) {
    return next(handleErrorConstructor(400, 'Некорректные данные'));
  }

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    res.send({ data: card });
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
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
      return next(handleErrorConstructor(404, 'Карточка не найдена'));
    }

    res.send({ data: card });
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
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
      return next(handleErrorConstructor(404, 'Карточка не найдена'));
    }

    res.send({ data: card });
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  deleteLikeFromCard,
};
