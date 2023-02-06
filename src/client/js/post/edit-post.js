import { fetcher } from "./../utils/fetcher";

const postEditFormButton = document.getElementById("post-edit-form__button");

const postId = postEditFormButton.dataset.post_id;

const handlePostEditFormButtonClick = (e) => {
  e.preventDefault();

  const newTitle = document.getElementById("post-edit-form__title").value;
  const newBoardName = document.getElementById(
    "post-edit-form__board-name"
  ).value;
  const newContent = document.getElementById("post-edit-form__content").value;

  fetcher({
    endpoint: `/post/${postId}`,
    method: "PUT",
    body: {
      title: newTitle,
      boardName: newBoardName,
      content: newContent,
    },
    isBodyJsonData: true,
  });
};

postEditFormButton.addEventListener("click", handlePostEditFormButtonClick);
