const checkParamNaN = (data, next) => {
  if (isNaN(data)) {
    const error = new Error("잘못된 접근입니다.");
    error.statusCode = 400;
    error.redirectURL = `/404`;
    next(error);
    return { isParamNaN: true };
  } else {
    return { isParamNaN: false };
  }
};

export default checkParamNaN;
