import localMiddleware from "./localMiddleware";
import checkUserLoggedIn from "./checkUserLoggedIn";
import checkUserAnonymous from "./checkUserAnonymous";

import multer from "multer";

export const uploadFiles = multer({ dest: "uploads/" });

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

export { localMiddleware, checkUserLoggedIn, checkUserAnonymous };
