const checkUserLoggedIn = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    const error = new Error("로그인이 필요합니다.");
    error.statusCode = 401;
    error.redirectURL = "/login";
    return next(error);
  }
};

export default checkUserLoggedIn;
