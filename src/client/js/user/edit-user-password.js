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
    new_password.value
  );

  if (!isPasswordSuccess) {
    alert(passwordErrorMessage);
    return;
  }

  fetch("/user/edit-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: password.value,
      new_password: newPassword.value,
      new_password_confirm: newPasswordConfirm.value,
    }),
  })
    .then(async (res) => {
      const json = await res.json();
      if (!res.ok) {
        return Promise.reject(json);
      }
      return json;
    })
    .then((redirectURL) => location.replace(redirectURL))
    .catch((errorMessage) => {
      if (errorMessage.haveToRedirect) {
        location.replace(errorMessage.redirectURL);
      }
    });
};

editUserPasswordForm.addEventListener(
  "submit",
  handleEditUserPasswordFormSubmit
);
