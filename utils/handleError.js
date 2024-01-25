function handleError(err, res, { badRequestErrorText, internalServerErrorText }) {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).send({ message: badRequestErrorText });
  }
  res.status(500).send({ message: internalServerErrorText });
}

function handleNotFound(res) {
  return res.status(404).send({ message: 'Ресурс не неайден' });
}

module.exports = {
  handleError,
  handleNotFound,
};
