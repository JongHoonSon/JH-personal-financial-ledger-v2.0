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
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
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

export const validateNickname = (nickname) => {
  const nicknameRegExp = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,16}$/;

  if (nicknameRegExp.test(nickname)) {
    return { isNicknameSuccess: true, nicknameErrorMessage: "" };
  } else {
    return {
      isNicknameSuccess: false,
      nicknameErrorMessage:
        "입력하신 닉네임이 한글(초성 불가), 영어, 숫자만을 포함하는지와 길이가 2이상 16이하인지 확인해 주세요.",
    };
  }
};

export const validateName = (name) => {
  const nameRegExp = /^[가-힣]{2,5}$/;

  if (nameRegExp.test(name)) {
    return { isNameSuccess: true, nameErrorMessage: "" };
  } else {
    return {
      isNameSuccess: false,
      nameErrorMessage:
        "입력하신 이름이 한글이고, 2자 이상, 5자 이하인지 확인해 주세요.",
    };
  }
};
