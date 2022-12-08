const loginRequiredPage = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "먼저 로그인을 해주세요.");
    return res.redirect("/login");
  }
};

export default loginRequiredPage;
