export const getBoard = (req, res) => {
  res.status(200).render("board/board", { pageTitle: "게시판" });
};
