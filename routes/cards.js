const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  deleteLikeFromCard,
} = require('../controllers/cards');

const createCardSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
});

const deleteCardSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

const likeCardSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

const deleteLikeFromCardSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

router.get('/', getCards);
router.post('/', createCardSchema, createCard);
router.delete('/:cardId', deleteCardSchema, deleteCard);
router.put('/:cardId/likes', likeCardSchema, likeCard);
router.delete('/:cardId/likes', deleteLikeFromCardSchema, deleteLikeFromCard);

module.exports = router;
