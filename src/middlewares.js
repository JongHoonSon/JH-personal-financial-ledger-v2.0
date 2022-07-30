import multer from "multer";
import Board from "./models/Board";

export const uploadFiles = multer({ dest: "uploads/" });

export const createObjectMiddleware = async (req, res, next) => {
  const boardList = ["수다", "질문", "꿀팁공유", "핫딜", "기타"];
  res.locals.boardList = boardList;

  let totalBoardExists;
  try {
    totalBoardExists = await Board.exists({ name: "전체게시판" });
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "전체게시판을 존재하는지 확인 과정에서 오류가 발생했습니다."
    );
  }
  if (!totalBoardExists) {
    try {
      await Board.create({ name: "전체게시판" });
    } catch (error) {
      console.log(error);
      req.flash("error", "전체게시판을 생성하는 과정에서 오류가 발생했습니다.");
    }

    for (let i = 0; i < boardList.length; i++) {
      try {
        await Board.create({ name: boardList[i] });
      } catch (error) {
        console.log(error);
        req.flash("error", "게시판을 생성하는 과정에서 오류가 발생했습니다.");
      }
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
