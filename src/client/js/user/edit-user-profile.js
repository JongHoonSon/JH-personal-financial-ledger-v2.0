import { fetcher } from "../utils/fetcher";

const editUserProfileForm = document.getElementById("edit-user-profile__form");

const handleEditUserProfileFormSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(editUserProfileForm);

  fetcher({
    endpoint: "/user/edit-profile",
    method: "PUT",
    body: formData,
    isBodyFormData: true,
  });
};

editUserProfileForm.addEventListener("submit", handleEditUserProfileFormSubmit);
