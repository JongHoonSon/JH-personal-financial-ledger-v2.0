export const validateUsername = (username) => {
  const usernameRegExp = /^[a-z]+[a-z0-9]{6,13}$/g;
  if (usernameRegExp.test(username)) {
    return { isUsernameSuccess: true, usernameErrorMessage: "" };
  } else {
    return {
      isUsernameSuccess: false,
      usernameErrorMessage:
        "입력하신 아이디가 영문으로 시작하는지와 길이가 7이상 14이하인지 확인해 주세요.",
    };
  }
};

export const validatePassword = (password) => {
  const passwordRegExp =
    /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
  if (passwordRegExp.test(password)) {
    return { isPasswordSuccess: true, passwordErrorMessage: "" };
  } else {
    return {
      isPasswordSuccess: false,
      passwordErrorMessage:
        "입력하신 비밀번호가 숫자, 영문, 특수문자를 최소 1개씩 포함하는지와 길이가 8이상 16이하인지 확인해 주세요. ",
    };
  }
};
