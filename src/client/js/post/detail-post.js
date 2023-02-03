import { fetcher } from "./../utils/fetcher";

const detailPost = document.getElementById("detail-post");
const { post_id } = detailPost.dataset;

const detailPostLink = document.getElementById("detail-post__link");

detailPostLink.innerText = location.href;

const increaseView = () => {
  fetcher({
    endpoint: `/post/increase-views/${post_id}`,
    method: "PUT",
  });
};

increaseView();

const autoResizeTextarea = () => {
  const textarea = document.getElementById("detail-post__content__textarea");

  if (textarea) {
    const scrollHeight = textarea.scrollHeight;
    textarea.style.height = `${scrollHeight + 8}px`;
  }
};

autoResizeTextarea();

const postLikeButton = document.getElementById("detail-post__like-button");

if (postLikeButton) {
  const handlePostLikeButtonClick = () => {
    fetcher({
      endpoint: `/post/toggle-likes/${post_id}`,
      method: "PUT",
    });
  };

  postLikeButton.addEventListener("click", handlePostLikeButtonClick);
}

const postDeleteButton = document.getElementById("detail-post__delete-button");

if (postDeleteButton) {
  const handlePostDeleteButtonClick = () => {
    const deleteConfirm = confirm("이 게시글을 삭제하시겠습니까?");
    if (deleteConfirm) {
      fetcher({
        endpoint: `/post/${post_id}`,
        method: "DELETE",
      });
    }
  };

  postDeleteButton.addEventListener("click", handlePostDeleteButtonClick);
}

const detailPostLinkCopy = document.getElementById(
  "detail-post__link__copy-button"
);

const copyPostLink = () => {
  navigator.clipboard
    .writeText(location.href)
    .then(() => alert("링크 복사 완료!"));
};

detailPostLinkCopy.addEventListener("click", copyPostLink);
