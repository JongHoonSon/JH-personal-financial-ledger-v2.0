const commentEditBtns = document.querySelectorAll(".comment__edit-btn");
const commentDeleteBtns = document.querySelectorAll(".comment__delete-btn");
const commentLikeBtns = document.querySelectorAll(".comment__like-btn");

const handleDeleteComment = (event) => {
  if (confirm("이 댓글을 삭제하시겠습니까?")) {
    const { comment_id } = event.target.dataset;

    fetch(`/comment/${comment_id}`, {
      method: "DELETE",
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
  }
};

commentDeleteBtns.forEach((commentDeleteBtn) => {
  commentDeleteBtn.addEventListener("click", handleDeleteComment);
});

const handleLikeComment = (event) => {
  const { comment_id } = event.target.dataset;

  fetch(`/comment/increase-likes/${comment_id}`, {
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

commentLikeBtns.forEach((commentLikeBtn) => {
  commentLikeBtn.addEventListener("click", handleLikeComment);
});

const handleEditComment = (event) => {
  // 댓글 id
  const { comment_id } = event.target.dataset;

  // 수정 버튼 / button.comment__option-btn.comment__edit-btn
  const commentEditBtn = event.target;
  console.log("commentEditBtn");
  console.log(commentEditBtn);

  // div.comment-info__right
  const commentInfoRight = commentEditBtn.parentElement;
  console.log("commentInfoRight");
  console.log(commentInfoRight);

  // 삭제 버튼 / button.comment__option-btn.comment__delete-btn
  const commentDeleteBtn = commentInfoRight.childNodes[1];
  console.log("commentDeleteBtn");
  console.log(commentDeleteBtn);

  // 확정 버튼 / button.comment__option-btn.comment__edit-confirm-btn
  const commentEditConfirmBtn = commentInfoRight.childNodes[2];
  console.log("commentEditConfirmBtn");
  console.log(commentEditConfirmBtn);

  // 취소 버튼 / button.comment__option-btn.comment__edit-cancel-btn
  const commentEditCancelBtn = commentInfoRight.childNodes[3];
  console.log("commentEditCancelBtn");
  console.log(commentEditCancelBtn);

  // 댓글 / div.comment-info__wrap
  const commentInfoWrap = commentInfoRight.parentElement;
  console.log("commentInfoWrap");
  console.log(commentInfoWrap);

  // 댓글 / div.comment
  const comment = commentInfoWrap.parentElement;
  console.log("comment");
  console.log(comment);

  // div.comment-content__wrap
  const commentContentWrap = comment.childNodes[1];
  console.log("commentContentWrap");
  console.log(commentContentWrap);

  // 댓글 내용 / pre.comment-content
  const commentContent = commentContentWrap.childNodes[0];
  console.log("commentContent");
  console.log(commentContent);

  // 댓글 수정 입력 창 / textarea.comment-content__edit-textarea
  const commentContentEditTextarea = commentContentWrap.childNodes[1];
  console.log("commentContentEditTextarea");
  console.log(commentContentEditTextarea);

  commentEditBtn.classList.add("hidden");
  commentDeleteBtn.classList.add("hidden");
  commentContent.classList.add("hidden");

  commentEditConfirmBtn.classList.remove("hidden");
  commentEditCancelBtn.classList.remove("hidden");
  commentContentEditTextarea.classList.remove("hidden");

  commentEditConfirmBtn.onclick = async () => {
    const newContent = commentContentEditTextarea.value;

    fetch(`/comment/${comment_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newContent }),
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

  commentEditCancelBtn.onclick = () => {
    commentContentEditTextarea.value = commentContent.innerText;

    commentEditBtn.classList.remove("hidden");
    commentDeleteBtn.classList.remove("hidden");
    commentContent.classList.remove("hidden");

    commentEditConfirmBtn.classList.add("hidden");
    commentEditCancelBtn.classList.add("hidden");
    commentContentEditTextarea.classList.add("hidden");
  };
};

console.log("commentEditBtns");
console.log(commentEditBtns);

commentEditBtns.forEach((commentEditBtn) => {
  commentEditBtn.addEventListener("click", handleEditComment);
});
