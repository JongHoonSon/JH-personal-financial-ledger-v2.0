import { fetcher } from "./../utils/fetcher";

const item = JSON.parse(
  document.getElementById("detail-item__wrap").dataset.item
);

const deleteItemButton = document.getElementById("detail-item__delete-button");

const handleDeleteItemButtonClick = () => {
  if (confirm("정말 이 내역을 삭제하시겠습니까?")) {
    fetcher({
      endpoint: `/item/${item.type}/${item._id}`,
      method: "DELETE",
    });
  }
};

deleteItemButton.addEventListener("click", handleDeleteItemButtonClick);

const pinItemButton = document.getElementById("detail-item__pin-button");

const handlePinItemButtonClick = () => {
  fetcher({
    endpoint: `/item/pin/${item.type}/${item._id}`,
    method: "PUT",
  });
};

pinItemButton.addEventListener("click", handlePinItemButtonClick);
