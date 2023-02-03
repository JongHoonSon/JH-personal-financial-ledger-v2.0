import { fetcher } from "../utils/fetcher";

const commentEditButtons = document.querySelectorAll(".comment__edit-button");
const commentDeleteButtons = document.querySelectorAll(
  ".comment__delete-button"
);
const commentLikeButtons = document.querySelectorAll(".comment__like-button");

const handleCommentDeleteButtonClick = (event) => {
  if (confirm("이 댓글을 삭제하시겠습니까?")) {
    const { comment_id } = event.target.dataset;

    fetcher({
      endpoint: `/comment/${comment_id}`,
      method: "DELETE",
    });
  }
};

commentDeleteButtons.forEach((commentDeleteButton) => {
  commentDeleteButton.addEventListener("click", handleCommentDeleteButtonClick);
});

const handleCommentLikeButtonClick = (event) => {
  const { comment_id } = event.target.dataset;

  fetcher({
    endpoint: `/comment/increase-likes/${comment_id}`,
    method: "PUT",
  });
};

commentLikeButtons.forEach((commentLikeButton) => {
  commentLikeButton.addEventListener("click", handleCommentLikeButtonClick);
});

const handleCommentEditButtonClick = (event) => {
  // 댓글 id
  const { comment_id } = event.target.dataset;

  // 수정 버튼 / button.comment__option-button.comment__edit-button
  const commentEditButton = event.target;
  console.log("commentEditButton");
  console.log(commentEditButton);

  // div.comment-info__right
  const commentInfoRight = commentEditButton.parentElement;
  console.log("commentInfoRight");
  console.log(commentInfoRight);

  // 삭제 버튼 / button.comment__option-button.comment__delete-button
  const commentDeleteButton = commentInfoRight.childNodes[1];
  console.log("commentDeleteButton");
  console.log(commentDeleteButton);

  // 확정 버튼 / button.comment__option-button.comment__edit-confirm-button
  const commentEditConfirmButton = commentInfoRight.childNodes[2];
  console.log("commentEditConfirmButton");
  console.log(commentEditConfirmButton);

  // 취소 버튼 / button.comment__option-button.comment__edit-cancel-button
  const commentEditCancelButton = commentInfoRight.childNodes[3];
  console.log("commentEditCancelButton");
  console.log(commentEditCancelButton);

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

  commentEditButton.classList.add("hidden");
  commentDeleteButton.classList.add("hidden");
  commentContent.classList.add("hidden");

  commentEditConfirmButton.classList.remove("hidden");
  commentEditCancelButton.classList.remove("hidden");
  commentContentEditTextarea.classList.remove("hidden");

  commentEditConfirmButton.onclick = async () => {
    const newContent = commentContentEditTextarea.value;

    fetcher({
      endpoint: `/comment/${comment_id}`,
      method: "PUT",
      body: { newContent },
      isBodyJsonData: true,
    });
  };

  commentEditCancelButton.onclick = () => {
    commentContentEditTextarea.value = commentContent.innerText;

    commentEditButton.classList.remove("hidden");
    commentDeleteButton.classList.remove("hidden");
    commentContent.classList.remove("hidden");

    commentEditConfirmButton.classList.add("hidden");
    commentEditCancelButton.classList.add("hidden");
    commentContentEditTextarea.classList.add("hidden");
  };
};

console.log("commentEditButtons");
console.log(commentEditButtons);

commentEditButtons.forEach((commentEditButton) => {
  commentEditButton.addEventListener("click", handleCommentEditButtonClick);
});
