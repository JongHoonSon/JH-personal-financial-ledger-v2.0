import Board from "../models/Board";
import { getTimeDiff } from "../utils";

export const getBoard = async (req, res) => {
  const { boardName, pageNum } = req.params;

  let board;
  try {
    board = await Board.findOne({ name: boardName }).populate({
      path: "postList",
      populate: [{ path: "board" }, { path: "owner" }],
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!board) {
    req.flash("error", "게시판을 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

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

  postList.forEach((el) => {
    el.dateGap = getTimeDiff(el.createdAt);
  });

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
