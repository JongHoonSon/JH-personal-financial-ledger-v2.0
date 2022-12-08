import Board from "../models/Board";
import { getTimeDiff } from "../utils";

class BoardController {
  async getBoard(req, res) {
    const { boardName, pageNum } = req.params;

    const selectedBoardName = boardName;

    let totalPostList = [];

    if (selectedBoardName === "전체게시판") {
      let boardList = await Board.find({}).populate({
        path: "postList",
        populate: [{ path: "board" }, { path: "owner" }],
      });

      boardList.forEach((board) => {
        if (board.postList.length !== 0) {
          totalPostList.push(...board.postList);
        }
      });

      totalPostList.sort((a, b) => b.seq - a.seq);
    } else {
      let selectedBoard;
      try {
        selectedBoard = await Board.findOne({
          name: selectedBoardName,
        }).populate({
          path: "postList",
          populate: [{ path: "board" }, { path: "owner" }],
        });
        totalPostList = selectedBoard.postList;
      } catch (error) {
        console.log(error);
        req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
        return res.status(500).redirect("/");
      }
      if (!selectedBoard) {
        req.flash("error", "게시판을 찾을 수 없습니다.");
        return res.status(404).redirect("/");
      }
    }

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

      if (selectedBoardName !== "전체게시판") {
        totalPostList.reverse();
      }

      for (let i = 0; i <= 9; i++) {
        if (totalPostList.length === (thisPageNum - 1) * 10 + i) {
          break;
        }
        postList.push(totalPostList[(thisPageNum - 1) * 10 + i]);
      }

      postList.forEach((el) => {
        el.dateGap = getTimeDiff(el.createdAt);
      });
    }

    if (thisPageNum < firstPageNum || thisPageNum > lastPageNum) {
      req.flash("error", "잘못된 접근입니다.");
      return res.status(404).redirect(`/board/${selectedBoardName}/1`);
    }

    const boardList = await Board.find({});
    const boardNameList = boardList.map((board) => board.name);

    return res.status(200).render("board/board", {
      pageTitle: "게시판",
      postList,
      selectedBoardName,
      thisPageNum,
      firstPageNum,
      lastPageNum,
      emptyFlag,
      boardNameList,
    });
  }
}

const boardController = new BoardController();

export default boardController;
