const detailPost = document.getElementById("detail-post");
const { post_id } = detailPost.dataset;

const detailPostLink = document.getElementById("detail-post__link");

detailPostLink.innerText = location.href;

const increaseView = () => {
  fetch(`/post/increase-views/${post_id}`, {
    method: "PUT",
  })
    .then(async (res) => {
      if (!res.ok) {
        const json = await res.json();
        return Promise.reject(json);
      }
    })
    .catch((errorMessage) => {
      if (errorMessage.haveToRedirect) {
        location.replace(errorMessage.redirectURL);
      }
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
  const toggleLike = () => {
    fetch(`/post/toggle-likes/${post_id}`, {
      method: "PUT",
    })
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json();
          return Promise.reject(json);
        }
        location.reload();
      })
      .catch((errorMessage) => {
        if (errorMessage.haveToRedirect) {
          location.replace(errorMessage.redirectURL);
        }
      });
  };

  postLikeButton.addEventListener("click", toggleLike);
}

const postDeleteButton = document.getElementById("detail-post__delete-button");

if (postDeleteButton) {
  const deletePost = () => {
    const deleteConfirm = confirm("이 게시물을 삭제하시겠습니까?");
    if (deleteConfirm) {
      fetch(`/post/delete/${post_id}`, {
        method: "DELETE",
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
    }
  };

  postDeleteButton.addEventListener("click", deletePost);
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
