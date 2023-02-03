import { fetcher } from "../utils/fetcher";

const itemEditForm = document.getElementById("item-edit-form");

const handleItemEditFormSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData(itemEditForm);
  const item = JSON.parse(itemEditForm.dataset.item);

  fetcher({
    endpoint: `/item/${item.type}/${item._id}`,
    method: "PUT",
    body: formData,
    isBodyFormData: true,
  });
};

itemEditForm.addEventListener("submit", handleItemEditFormSubmit);
