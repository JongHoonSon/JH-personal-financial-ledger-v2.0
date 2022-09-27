const imageUpload = document.getElementById("add-item-input__image-upload");

function handleImagePreview() {
  if (imageUpload.files && imageUpload.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("add-item-input__image-preview").src =
        event.target.result;
    };
    reader.readAsDataURL(imageUpload.files[0]);
  } else {
    const originImageUrl = imageUpload.dataset.id;
    document.getElementById("add-item-input__image-preview").src =
      "/" + originImageUrl;
  }
}

imageUpload.addEventListener("change", handleImagePreview);
