const checkParamValue = (param, values, next) => {
  let isParamCorrectValue = false;
  if (values.length > 0) {
    for (let i = 0; i < values.length; i++) {
      if (param === values[i]) {
        isParamCorrectValue = true;
        break;
      }
    }

    if (!isParamCorrectValue) {
      const error = new Error("잘못된 주소입니다.");
      error.statusCode = 400;
      error.redirectURL = `/404`;
      next(error);
    }

    return { isParamCorrectValue };
  }
};

export default checkParamValue;
