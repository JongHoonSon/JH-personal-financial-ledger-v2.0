import { fetcher } from "../utils/fetcher";

const editUserProfileForm = document.getElementById("edit-user-profile__form");

const handleEditUserProfileFormSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(editUserProfileForm);

  fetcher("/user/edit-profile", "PUT", formData);
};

editUserProfileForm.addEventListener("submit", handleEditUserProfileFormSubmit);
