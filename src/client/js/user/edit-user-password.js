const editUserPasswordForm = document.getElementById(
  "edit-user-password__form"
);

const handleEditUserPasswordFormSubmit = (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const new_password = document.getElementById("new_password").value;
  const new_password_confirm = document.getElementById(
    "new_password_confirm"
  ).value;

  fetch("/user/edit-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      new_password,
      new_password_confirm,
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
