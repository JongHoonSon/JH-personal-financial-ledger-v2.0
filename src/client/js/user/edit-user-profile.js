import { fetcher } from "../utils/fetcher";
import { validateName, validateNickname } from "../utils/validateInput";

const editUserProfileForm = document.getElementById("edit-user-profile__form");
const name = document.getElementById("name");
const nickname = document.getElementById("nickname");

const handleEditUserProfileFormSubmit = (e) => {
  e.preventDefault();

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

  const formData = new FormData(editUserProfileForm);

  fetcher({
    endpoint: "/user/edit-profile",
    method: "PUT",
    body: formData,
    isBodyFormData: true,
  });
};

editUserProfileForm.addEventListener("submit", handleEditUserProfileFormSubmit);
