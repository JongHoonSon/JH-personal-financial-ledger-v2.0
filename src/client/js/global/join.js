import {
  validateName,
  validateNickname,
  validatePassword,
  validateUsername,
} from "../utils/validateInput";

const joinForm = document.getElementById("join-form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password_confirm");
const name = document.getElementById("name");
const nickname = document.getElementById("nickname");

const handleJoinFormSubmit = (e) => {
  const { isUsernameSuccess, usernameErrorMessage } = validateUsername(
    username.value
  );

  if (!isUsernameSuccess) {
    e.preventDefault();
    alert(usernameErrorMessage);
    return;
  }

  if (password.value !== passwordConfirm.value) {
    e.preventDefault();
    alert("입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    return;
  }

  const { isPasswordSuccess, passwordErrorMessage } = validatePassword(
    password.value
  );

  if (!isPasswordSuccess) {
    e.preventDefault();
    alert(passwordErrorMessage);
    return;
  }

  const { isNameSuccess, nameErrorMessage } = validateName(name.value);

  if (!isNameSuccess) {
    e.preventDefault();
    alert(nameErrorMessage);
    return;
  }

  const { isNicknameSuccess, nicknameErrorMessage } = validateNickname(
    nickname.value
  );

  if (!isNicknameSuccess) {
    e.preventDefault();
    alert(nicknameErrorMessage);
    return;
  }
};

joinForm.addEventListener("submit", handleJoinFormSubmit);
