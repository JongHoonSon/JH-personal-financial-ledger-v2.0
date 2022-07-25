export const getBoard = async (req, res) => {
  const { category } = req.params;

  res.status(200).render("board/board", { pageTitle: "게시판", postList });
};
