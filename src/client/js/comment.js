const commentEditBtns = document.querySelectorAll(".comment-edit-btn");
const commentDeleteBtns = document.querySelectorAll(".comment-delete-btn");

console.log("commentEditBtns");
console.log(commentEditBtns);
console.log("commentDeleteBtns");
console.log(commentDeleteBtns);

const handleEditComment = (event) => {
  console.log("수정 버튼 클릭");

  // 수정 버튼
  const commentEditBtn = event.target;

  // 버튼들의 부모 태그인 div
  const commentOptions = commentEditBtn.parentElement;

  // 삭제 버튼
  const commentDeleteBtn = commentOptions.childNodes[1];

  // 수정 확정 버튼
  const commentEditConfirmBtn = commentOptions.childNodes[2];

  // 수정 취소 버튼
  const commentEditCancelBtn = commentOptions.childNodes[3];

  // 전체 댓글
  const comment = commentOptions.parentElement;

  // 댓글 정보가 모인 div
  const commentMain = comment.childNodes[0];

  // 기존 댓글 내용
  const commentContent = commentMain.childNodes[1];

  // 댓글 수정 창
  const commentContentEditTextarea = commentMain.childNodes[2];

  //   console.log("commentEditBtn");
  //   console.log(commentEditBtn);
  //   console.log("commentOptions");
  //   console.log(commentOptions);
  //   console.log("commentDeleteBtn");
  //   console.log(commentDeleteBtn);
  //   console.log("commentEditConfirmBtn");
  //   console.log(commentEditConfirmBtn);
  console.log("commentEditCancelBtn");
  console.log(commentEditCancelBtn);
  //   console.log("comment");
  //   console.log(comment);
  //   console.log("commentMain");
  //   console.log(commentMain);
  //   console.log("commentContent");
  //   console.log(commentContent);
  //   console.log("commentContentEditTextarea");
  //   console.log(commentContentEditTextarea);

  commentEditBtn.classList.add("hidden");
  commentDeleteBtn.classList.add("hidden");
  commentContent.classList.add("hidden");

  commentEditConfirmBtn.classList.remove("hidden");
  commentEditCancelBtn.classList.remove("hidden");
  commentContentEditTextarea.classList.remove("hidden");

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

const handleCancelEditComment = (event) => {};

commentEditBtns.forEach((btn) => {
  btn.addEventListener("click", handleEditComment);
});

// commentEditCancelBtns.forEach((btn) => {
//   btn.addEventListener("click", handleCancelEditComment);
// });
