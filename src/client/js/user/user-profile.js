import { fetcher } from "./../utils/fetcher";

const deleteAccountButton = document.getElementById(
  "user-profile__delete-account-button"
);

const handleDeleteAccountButtonClick = () => {
  if (confirm("회원탈퇴 하시겠습니까?")) {
    fetcher({
      endpoint: "/user",
      method: "PUT",
    });
  }
};

deleteAccountButton.addEventListener("click", handleDeleteAccountButtonClick);
