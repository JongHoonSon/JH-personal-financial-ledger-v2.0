const imageUpload = document.querySelector(".image-upload");

function handleImagePreview() {
  if (imageUpload.files && imageUpload.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.querySelector(".image-preview").src = event.target.result;
    };
    reader.readAsDataURL(imageUpload.files[0]);
  } else {
    const originImageUrl = imageUpload.dataset.id;
    document.querySelector(".image-preview").src = "/" + originImageUrl;
  }
}

imageUpload.addEventListener("change", handleImagePreview);
