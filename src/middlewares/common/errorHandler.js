const errorHandler = (error, req, res, next) => {
  if (error) {
    console.log("error");
    console.log(error);

    // 페이지 접속에 대한 GET 요청
    if (req.method === "GET") {
      console.log("페이지 접속에 대한 GET 요청에서 error 발생");
      req.flash(
        "error",
        error.messageToShow ? error.messageToShow : error.message
      );
      return res
        .status(error.statusCode ? error.statusCode : 500)
        .redirect(error.redirectURL ? error.redirectURL : "/");
    }

    // form으로 보낸 POST 요청
    else if (
      req.headers["content-type"] === "application/x-www-form-urlencoded"
    ) {
      console.log("form으로 보낸 POST 요청에서 error 발생");
      req.flash(
        "error",
        error.messageToShow ? error.messageToShow : error.message
      );
      return res
        .status(error.statusCode ? error.statusCode : 400)
        .redirect(error.redirectURL ? error.redirectURL : "/");
    }

    // fetch로 보낸 POST, PUT, DELETE 요청
    else {
      console.log("fetch으로 보낸 요청에서 error 발생");
      req.flash(
        "error",
        error.messageToShow ? error.messageToShow : error.message
      );
      return res.status(error.statusCode ? error.statusCode : 400).json({
        haveToRedirect: true,
        redirectURL: error.redirectURL ? error.redirectURL : "/",
      });
    }
  }
};

export default errorHandler;
