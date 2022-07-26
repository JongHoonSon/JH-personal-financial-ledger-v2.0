import Board from "../models/Board";

export const getBoard = async (req, res) => {
  const { boardName, pageNum } = req.params;

  const board = await Board.findOne({ name: boardName }).populate({
    path: "postList",
    populate: [{ path: "board" }, { path: "owner" }],
  });
  const totalPostList = board.postList;

  let emptyFlag;
  let thisPageNum;
  let firstPageNum;
  let lastPageNum;
  let postList = [];

  if (totalPostList.length === 0) {
    emptyFlag = true;
    thisPageNum = Number(pageNum);
    firstPageNum = 1;
    lastPageNum = 1;
  } else {
    emptyFlag = false;
    thisPageNum = Number(pageNum);
    firstPageNum = 1;
    lastPageNum = Math.ceil(totalPostList.length / 10);

    totalPostList.reverse();

    console.log("totalPostList");
    console.log(totalPostList);

    for (let i = 0; i <= 9; i++) {
      if (totalPostList.length === (thisPageNum - 1) * 10 + i) {
        break;
      }
      postList.push(totalPostList[(thisPageNum - 1) * 10 + i]);
    }
  }

  if (thisPageNum < firstPageNum || thisPageNum > lastPageNum) {
    req.flash("error", "잘못된 접근입니다.");
    return res.status(404).redirect(`/board/${boardName}/1`);
  }

  return res.status(200).render("board/board", {
    pageTitle: "게시판",
    postList,
    boardName,
    thisPageNum,
    firstPageNum,
    lastPageNum,
    emptyFlag,
  });
};
