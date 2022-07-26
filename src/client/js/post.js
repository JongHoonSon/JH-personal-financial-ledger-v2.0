const detailPost = document.getElementById("detailPost");

const increaseView = () => {
  const { id } = detailPost.dataset;
  fetch(`/post/increase-views/${id}/`, {
    method: "POST",
  });
};

increaseView();
