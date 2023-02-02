const checkUserAnonymous = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    const error = new Error("로그아웃이 필요한 페이지입니다.");
    error.statusCode = 401;
    next(error);
    return;
  }
};

export default checkUserAnonymous;
