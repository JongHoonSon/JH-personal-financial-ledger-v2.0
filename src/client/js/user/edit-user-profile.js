const editUserProfileForm = document.getElementById("edit-user-profile__form");

const handleEditUserProfileForm = (e) => {
  e.preventDefault();

  const formData = new FormData(editUserProfileForm);

  fetch("/user/edit-profile", {
    method: "PUT",
    body: formData,
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

editUserProfileForm.addEventListener("submit", handleEditUserProfileForm);
