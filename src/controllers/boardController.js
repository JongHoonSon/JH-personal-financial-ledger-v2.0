import { boardModel } from "./../db/models";
import { getCreatedTime } from "../utils";
import { checkParamNaN } from "../middlewares";

class BoardController {
  async getBoard(req, res, next) {
    const { boardName, pageNum } = req.params;

    const { isParamNaN } = checkParamNaN(pageNum, next);
    if (isParamNaN) return;

    const searchKeyword = boardName === "전체게시판" ? {} : { name: boardName };

    let boardList;
    try {
      boardList = await boardModel.findWithPopulate(searchKeyword).populate({
        path: "postList",
        populate: [{ path: "board" }, { path: "owner" }],
      });
    } catch (error) {
      error.messageToShow =
        "게시판을 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    if (boardList.length === 0) {
      const error = new Error("게시판을 DB에서 찾을 수 없습니다.");
      error.statusCode = 404;
      next(error);
      return;
    }

    const totalPostList = [];
    boardList.forEach((board) => {
      if (board.postList.length !== 0) {
        totalPostList.push(...board.postList);
      }
    });

    let isBoardEmpty;
    const firstPageNum = 1;
    const currPageNum = Number(pageNum);
    let lastPageNum;
    if (totalPostList.length === 0) {
      isBoardEmpty = true;
      lastPageNum = 1;
    } else {
      isBoardEmpty = false;
      lastPageNum = Math.ceil(totalPostList.length / 10);
    }

    if (firstPageNum > currPageNum || currPageNum > lastPageNum) {
      const error = new Error("잘못된 접근입니다.");
      error.statusCode = 400;
      error.redirectURL = `/board/${boardName}/1`;
      next(error);
      return;
    }
    const currPagePostList = [];
    if (!isBoardEmpty) {
      if (boardName === "전체게시판") {
        totalPostList.sort((a, b) => b.seq - a.seq);
      } else {
        totalPostList.reverse();
      }

      // totalPostList에서 currPageNum(현재 페이지)에 보여줄 10개의 post를 currPagePostList에 넣는 로직
      for (let i = 0; i <= 9; i++) {
        if (totalPostList.length === (currPageNum - 1) * 10 + i) {
          break;
        }
        currPagePostList.push(totalPostList[(currPageNum - 1) * 10 + i]);
      }

      currPagePostList.forEach((post) => {
        post.createdTime = getCreatedTime(post.createdAt);
      });
    }

    const totalBoardList = req.session.boardList;
    const totalBoardNameList = totalBoardList.map((board) => board.name);

    return res.status(200).render("board/board", {
      pageTitle: "게시판",
      postList: currPagePostList,
      selectedBoardName: boardName,
      currPageNum,
      firstPageNum,
      lastPageNum,
      isBoardEmpty,
      boardNameList: totalBoardNameList,
    });
  }
}

const boardController = new BoardController();

export default boardController;
