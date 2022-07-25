import Board from "../models/Board";

export const getBoard = async (req, res) => {
  const { boardName, pageNum } = req.params;

  const board = await Board.findOne({ name: boardName }).populate({
    path: "postList",
    populate: { path: "board" },
  });
  const postList = board.postList;

  let thisPageNum = Number(pageNum);
  let firstPageNum = 1;
  let lastPageNum = Math.ceil(postList.length / 10);

  let emptyFlag = false;

  if (postList.length === 0) {
    emptyFlag = true;
    thisPageNum = Number(pageNum);
    firstPageNum = 1;
    lastPageNum = 1;
  } else {
    thisPageNum = Number(pageNum);
    firstPageNum = 1;
    lastPageNum = Math.ceil(postList.length / 10);
  }

  if (thisPageNum < firstPageNum || thisPageNum > lastPageNum) {
    req.flash("error", "잘못된 접근입니다.");
    res.status(404).redirect(`/board/${boardName}/1`);
  }

  res.status(200).render("board/board", {
    pageTitle: "게시판",
    postList,
    boardName,
    thisPageNum,
    firstPageNum,
    lastPageNum,
    emptyFlag,
  });
};
