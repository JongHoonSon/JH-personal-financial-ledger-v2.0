export const anonymousUserPage = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "로그아웃이 필요한 페이지입니다.");
    return res.redirect("/");
  }
};
