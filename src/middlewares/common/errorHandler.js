const errorHandler = (error, req, res, next) => {
  if (error) {
    console.log("error");
    console.log(error);

    console.log("req.method");
    console.log(req.method);

    console.log('req.headers["sec-fetch-dest"]');
    console.log(req.headers["sec-fetch-dest"]);

    console.log('req.headers["content-type"]');
    console.log(req.headers["content-type"]);

    console.log('req.headers["content-length"]');
    console.log(req.headers["content-length"]);

    // 페이지 접속에 대한 GET 요청
    if (req.method === "GET" && req.headers["sec-fetch-dest"] === "document") {
      console.log("페이지 접속에 대한 GET 요청");
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
      console.log("form에서 보낸 POST 요청");
      req.flash(
        "error",
        error.messageToShow ? error.messageToShow : error.message
      );
      return res
        .status(error.statusCode ? error.statusCode : 400)
        .redirect(error.redirectURL ? error.redirectURL : "/");
    }

    // fetch로 보낸 POST, PUT, DELETE 요청
    else if (
      req.headers["content-length"] === "0" ||
      req.headers["content-type"] === "application/json" ||
      req.method === "POST" ||
      req.method === "PUT" ||
      req.method === "DELETE"
    ) {
      console.log("fetch에서 보낸 POST 요청");
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
