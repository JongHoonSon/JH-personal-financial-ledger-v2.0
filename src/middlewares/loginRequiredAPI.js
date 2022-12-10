const loginRequiredAPI = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "로그인이 필요한 API입니다.");
    return res.status(401).json("/login");
  }
};

export default loginRequiredAPI;
