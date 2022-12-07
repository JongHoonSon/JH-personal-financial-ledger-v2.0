const deleteBtn = document.querySelector(".delete-icon");

function deleteConfirm(event) {
  if (!confirm("정말 이 내역을 삭제하시겠습니까?")) {
    event.preventDefault();
  }
}

deleteBtn.addEventListener("click", deleteConfirm);
