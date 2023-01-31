const item = JSON.stringify(
  document.getElementById("detail-item__wrap").dataset.item
);

const pinItemButton = document.getElementById("detail-item__pin-button");

const deleteItemButton = document.getElementById("detail-item__delete-button");

function handleDeleteItemButtonClick(event) {
  if (!confirm("정말 이 내역을 삭제하시겠습니까?")) {
    event.preventDefault();
  }

  fetch("/");
}

deleteBtn.addEventListener("click", handleDeleteItemButtonClick);
