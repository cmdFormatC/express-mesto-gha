const router = require('express').Router();

const {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  deleteLikeFromCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', deleteLikeFromCard);

module.exports = router;
