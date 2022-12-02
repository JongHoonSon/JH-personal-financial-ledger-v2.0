const detailPost = document.getElementById("detail-post");
const { post_id } = detailPost.dataset;

const increaseView = () => {
  fetch(`/post/increase-views/${post_id}`, {
    method: "POST",
  });
};

increaseView();

const postLikeButton = document.getElementById("detail-post__like-button");

if (postLikeButton) {
  const increateLike = () => {
    fetch(`/post/increase-likes/${post_id}`, {
      method: "POST",
    }).then(() => alert("좋아요 성공"));
  };

  postLikeButton.addEventListener("click", increateLike);
}

const postDeleteButton = document.getElementById("detail-post__delete-button");

if (postDeleteButton) {
  const deletePost = () => {
    console.log("clicked");

    const deleteConfirm = confirm("이 게시물을 삭제하시겠습니까?");
    if (deleteConfirm) {
      fetch(`/post/delete/${post_id}`, {
        method: "POST",
      }).then(() => {
        alert("삭제 성공");
      });
    }
  };

  postDeleteButton.addEventListener("click", deletePost);
}
