const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (err) {
    res.status(500).send({ message: err.message });
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
    res.status(500).send({ message: err.message });
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
    res.status(500).send({ message: err.message });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    res.send({ data: card });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
const deleteLikeFromCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true }
    );

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    res.send({ data: card });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  deleteLikeFromCard,
};