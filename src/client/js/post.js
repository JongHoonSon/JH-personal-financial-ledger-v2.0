const detailPost = document.getElementById("detailPost");

const increaseView = () => {
  const { post_id } = detailPost.dataset;
  fetch(`/post/increase-views/${post_id}/`, {
    method: "POST",
  });
};

increaseView();
