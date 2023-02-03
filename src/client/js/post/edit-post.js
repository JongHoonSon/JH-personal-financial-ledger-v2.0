const postEditFormButton = document.getElementById("post-edit-form__button");

const postId = postEditFormButton.dataset.post_id;

const handlePostEditFormButtonClick = (e) => {
  e.preventDefault();

  const newTitle = document.getElementById("post-edit-form__title").value;
  const newBoardName = document.getElementById(
    "post-edit-form__board-name"
  ).value;
  const newContent = document.getElementById("post-edit-form__content").value;

  fetch(`/post/${postId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newTitle,
      boardName: newBoardName,
      content: newContent,
    }),
  })
    .then(async (res) => {
      const json = await res.json();
      if (!res.ok) {
        return Promise.reject(json);
      }
      return json;
    })
    .then((redirectURL) => location.replace(redirectURL))
    .catch((errorMessage) => {
      if (errorMessage.haveToRedirect) {
        location.replace(errorMessage.redirectURL);
      }
    });
};

postEditFormButton.addEventListener("click", handlePostEditFormButtonClick);