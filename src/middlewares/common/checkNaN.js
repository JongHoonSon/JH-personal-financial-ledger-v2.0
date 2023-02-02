const checkNaN = (data, next) => {
  if (isNaN(data)) {
    const error = new Error("숫자 형태여야 하는 파라미터가 없습니다.");
    error.statusCode = 400;
    error.redirectURL = `/`;
    next(error);
    return { isNaN: true };
  } else {
    return { isNaN: false };
  }
};

export default checkNaN;
