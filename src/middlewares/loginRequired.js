const loginRequired = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    // 페이지 접속에 대한 GET 요청
    if (req.method === "GET" && req.headers["sec-fetch-dest"] === "document") {
      console.log("페이지에 대한 GET 요청");
      req.flash("error", "로그인한 유저만 접속 가능한 페이지입니다.");
      return res.redirect("/login");
    }

    // form으로 보낸 POST 요청
    else if (
      req.headers["content-type"] === "application/x-www-form-urlencoded"
    ) {
      console.log("form으로 보내는 POST 요청");
      req.flash("error", "먼저 로그인해 주세요.");
      return res.redirect("/login");
    }

    // fetch로 보낸 POST, PUT, DELETE 요청
    else if (
      req.headers["content-length"] === "0" ||
      req.headers["content-type"] === "application/json" ||
      req.method === "PUT" ||
      req.method === "DELETE"
    ) {
      console.log("fetch로 보내는 POST 요청");
      req.flash("error", "먼저 로그인해 주세요.");
      return res
        .status(401)
        .json({ haveToRedirect: true, redirectURL: "/login" });
    }
  }
};

export default loginRequired;
