export const getBoard = (req, res) => {
  res.status(200).render("board/board", { pageTitle: "게시판" });
};

export const getAddWriting = (req, res) => {
  res.status(200).render("board/addWriting", { pageTitle: "글 작성" });
};
