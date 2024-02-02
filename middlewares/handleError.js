function handleError(err, req, res, next) {
  console.log(err);
  if (!err.statusCode || !err.message) {
    res.status(500).send({ message: 'Ошибка сервера' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
}

module.exports = {
  handleError,
};
