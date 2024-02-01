require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const auth = require('./middlewares/auth');
const { handleErrorConstructor } = require('./utils/handleErrorTools');

const {
  createUser, login,
} = require('./controllers/users');
const { handleError } = require('./middlewares/handleError');

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(handleErrorConstructor(404, 'Ресурс не найден'));
});

app.use(handleError);

app.listen(PORT, () => {
  console.log(`Ссылка на сервер: ${BASE_PATH + PORT}`);
});
