const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  getUserById, getUsers, updateUserProfile, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

const updateUserProfileSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).or('name', 'about'),
});

const updateUserAvatarSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
});

const getUserByIdSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserByIdSchema, getUserById);
router.patch('/me', updateUserProfileSchema, updateUserProfile);
router.patch('/me/avatar', updateUserAvatarSchema, updateUserAvatar);

module.exports = router;
