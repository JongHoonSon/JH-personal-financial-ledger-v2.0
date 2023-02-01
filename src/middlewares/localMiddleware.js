const localMiddleware = (req, res, next) => {
  res.locals.loggedInUser = req.session.user || {};
  res.locals.loggedIn = Boolean(req.session.loggedIn);

  next();
};

export default localMiddleware;
