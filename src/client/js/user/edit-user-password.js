import { fetcher } from "../utils/fetcher";
import { validatePassword } from "../utils/validateInput";

const editUserPasswordForm = document.getElementById(
  "edit-user-password__form"
);

const handleEditUserPasswordFormSubmit = (e) => {
  e.preventDefault();

  const password = document.getElementById("password");
  const newPassword = document.getElementById("new_password");
  const newPasswordConfirm = document.getElementById("new_password_confirm");

  if (newPassword.value !== newPasswordConfirm.value) {
    alert("입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
    return;
  }

  const { isPasswordSuccess, passwordErrorMessage } = validatePassword(
    newPassword.value
  );

  if (!isPasswordSuccess) {
    alert(passwordErrorMessage);
    return;
  }

  const body = JSON.stringify({
    password: password.value,
    new_password: newPassword.value,
    new_password_confirm: newPasswordConfirm.value,
  });

  fetcher("/user/edit-password", "PUT", body);
};

editUserPasswordForm.addEventListener(
  "submit",
  handleEditUserPasswordFormSubmit
);
