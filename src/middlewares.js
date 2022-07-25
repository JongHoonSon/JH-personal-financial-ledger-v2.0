import multer from "multer";
import Board from "./models/Board";

export const uploadFiles = multer({ dest: "uploads/" });

export const createObjectMiddleware = async (req, res, next) => {
  const boardList = ["전체게시판", "질문", "꿀팁공유", "핫딜", "기타"];

  for (let i = 0; i < boardList.length; i++) {
    const board = await Board.exists({ name: boardList[i] });

    if (!board) {
      await Board.create({ name: boardList[i] });
      console.log(`${boardList[i]} created!`);
    }
  }

  next();
};

export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  const date = new Date();
  res.locals.date = date;
  res.locals.thisYear = date.getFullYear().toString();
  res.locals.thisMonth = (date.getMonth() + 1).toString().padStart(2, 0);
  res.locals.thisDay = date.getDate().toString().padStart(2, 0);
  console.log(res.locals);
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
