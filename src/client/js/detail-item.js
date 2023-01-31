const item = JSON.parse(
  document.getElementById("detail-item__wrap").dataset.item
);

const pinItemButton = document.getElementById("detail-item__pin-button");

const deleteItemButton = document.getElementById("detail-item__delete-button");

const handleDeleteItemButtonClick = () => {
  if (confirm("정말 이 내역을 삭제하시겠습니까?")) {
    fetch(`/item/${item.type}/${item._id}`, { method: "DELETE" })
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
  }
};

deleteItemButton.addEventListener("click", handleDeleteItemButtonClick);
