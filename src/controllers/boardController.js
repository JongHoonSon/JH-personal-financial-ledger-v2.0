import Board from "../models/Board";

export const getBoard = async (req, res) => {
  const { boardName } = req.params;

  const board = await Board.findOne({ name: boardName }).populate({
    path: "postList",
    populate: { path: "board" },
  });
  const postList = board.postList;

  res.status(200).render("board/board", { pageTitle: "게시판", postList });
};
