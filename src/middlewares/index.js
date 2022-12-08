import multer from "multer";

export const uploadFiles = multer({ dest: "uploads/" });

export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};

  const date = new Date();
  res.locals.date = date;
  res.locals.thisYear = date.getFullYear().toString();
  res.locals.thisMonth = (date.getMonth() + 1).toString().padStart(2, 0);
  res.locals.thisDay = date.getDate().toString().padStart(2, 0);

  next();
};

export const loggedInUserOnly = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "먼저 로그인을 해주세요.");
    return res.redirect("/login");
  }
};

export const publicOnly = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "잘못된 접근입니다.");
    return res.redirect("/");
  }
};

export const unauthorizedAccess = (req, res, next) => {
  req.flash("error", "권한이 없습니다.");
  return res.status(403).redirect("/");
};

// html 문서를 가져오는 GET 요청에서만 방문한 URL을 세션의 logHistory에 기록하는 미들웨어
export const logHistory = (req, res, next) => {
  if (req.method === "GET" && req.headers["sec-fetch-dest"] === "document") {
    if (!req.session.logHistory) {
      req.session.logHistory = {
        prev1: req.path,
      };
    } else {
      req.session.logHistory.prev2 = req.session.logHistory.prev1;
      req.session.logHistory.prev1 = req.path;
    }

    req.session.save(function (err) {
      if (err) {
        res.send("Error occured");
      }
    });
  }

  next();
};
