const joinForm = document.getElementById("join-form");
const password = document.getElementById("password");
const passwordConfirm = document.getElementById("password_confirm");

const handleJoinFormSubmit = (e) => {
  if (password.value !== passwordConfirm.value) {
    e.preventDefault();
    alert("입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
  }
};

joinForm.addEventListener("submit", handleJoinFormSubmit);
