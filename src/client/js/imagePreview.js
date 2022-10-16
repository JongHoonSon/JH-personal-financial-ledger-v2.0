const imageUpload = document.querySelector(".image-upload");

function handleImagePreview() {
  const imageName = document.querySelector(".image-name");
  if (imageUpload.files && imageUpload.files[0]) {
    const reader = new FileReader();
    reader.onload = function (event) {
      document.querySelector(".image-preview").src = event.target.result;
    };
    reader.readAsDataURL(imageUpload.files[0]);
    // console.log(imageName);
    imageName.value = imageUpload.value;
  } else {
    const originImageUrl = imageUpload.dataset.id;
    document.querySelector(".image-preview").src = "/" + originImageUrl;
    imageName.value = "파일첨부";
  }
}

imageUpload.addEventListener("change", handleImagePreview);
