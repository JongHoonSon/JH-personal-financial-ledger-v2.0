const imageUploadInput = document.getElementById(
  "image-upload__uploader__image-input"
);

function handleImageUploadInputChange() {
  const imageName = document.getElementById(
    "image-upload__uploader__image-name"
  );
  if (imageUploadInput.files && imageUploadInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.getElementById("image-upload__preview").src =
        event.target.result;
    };
    reader.readAsDataURL(imageUploadInput.files[0]);
    imageName.value = imageUploadInput.value;
  } else {
    const originImageUrl = imageUploadInput.dataset.id;
    document.getElementById("image-upload__preview").src = "/" + originImageUrl;
    imageName.value = "파일첨부";
  }
}

imageUploadInput.addEventListener("change", handleImageUploadInputChange);
