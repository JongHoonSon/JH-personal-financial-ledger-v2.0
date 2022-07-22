export const getBoard = (req, res) => {
  res.status(200).render("board/board", { pageTitle: "게시판" });
};

export const getAddPost = (req, res) => {
  res.status(200).render("board/addPost", { pageTitle: "글 작성" });
};

export const postAddPost = (req, res) => {
  const { title, category, content } = req.body;

  console.log("title, category, content");
  console.log(title, category, content);

  res.status(200).render("board/addPost", { pageTitle: "글 작성" });
};
