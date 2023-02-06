// html 문서를 가져오는 GET 요청에 대해서만 동작하는 미들웨어
// 방문한 페이지의 URL을 req.session.history에 기록함
const logHistory = (req, res, next) => {
  if (!req.session.history) {
    req.session.history = {
      currPageURL: req.path,
      prevPageURL: undefined,
    };
  }

  const { history } = req.session;

  if (req.method === "GET" && req.headers["sec-fetch-dest"] === "document") {
    if (req.path !== history.currPageURL) {
      history.prevPageURL = history.currPageURL;
      history.currPageURL = req.path;
    }
  }

  req.session.save(function (err) {
    if (err) {
      return res.status(500).send("세션 오류 발생");
    }
  });

  next();
};

export default logHistory;
