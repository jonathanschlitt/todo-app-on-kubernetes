const errorHandler = (err, reg, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.log(err);

  res.status(statusCode);

  res.json({
    message: err.message,
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
