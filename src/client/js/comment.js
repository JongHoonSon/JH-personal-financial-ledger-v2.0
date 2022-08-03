const { post_id } = document.getElementById("detailPost").dataset;

const commentEditBtns = document.querySelectorAll(".comment-edit-btn");
const commentDeleteBtns = document.querySelectorAll(".comment-delete-btn");

const handleEditComment = (event) => {
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

  // 댓글
  const comment = commentOptions.parentElement;

  // 댓글 id
  const { comment_id } = comment.dataset;

  // 댓글의 정보가 모인 div
  const commentMain = comment.childNodes[0];

  // 댓글 내용
  const commentContent = commentMain.childNodes[1];

  // 댓글 수정 입력 창
  const commentContentEditTextarea = commentMain.childNodes[2];

  commentEditBtn.classList.add("hidden");
  commentDeleteBtn.classList.add("hidden");
  commentContent.classList.add("hidden");

  commentEditConfirmBtn.classList.remove("hidden");
  commentEditCancelBtn.classList.remove("hidden");
  commentContentEditTextarea.classList.remove("hidden");

  commentEditConfirmBtn.onclick = async () => {
    const newContent = commentContentEditTextarea.value;

    const response = await fetch(`/comment/edit/${post_id}/${comment_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newContent }),
    });

    if (response.status === 200) {
      window.location.reload();
    }
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

commentEditBtns.forEach((btn) => {
  btn.addEventListener("click", handleEditComment);
});
