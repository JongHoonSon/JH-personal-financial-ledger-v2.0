const itemEditForm = document.getElementById("item-edit-form");

const handleItemEditFormSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(itemEditForm);
  const item = JSON.parse(itemEditForm.dataset.item);

  fetch(`/item/${item.type}/${item._id}`, {
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
    .then((redirectURL) => {
      location.replace(redirectURL);
    })
    .catch((errorMessage) => {
      if (errorMessage.haveToRedirect) {
        location.replace(errorMessage.redirectURL);
      }
    });
};

itemEditForm.addEventListener("submit", handleItemEditFormSubmit);
