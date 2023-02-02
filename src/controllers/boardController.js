import { boardModel } from "./../db/models";
import { getCreatedTime } from "../utils";

class BoardController {
  async getBoard(req, res, next) {
    const { boardName, pageNum } = req.params;

    let boardList;
    let totalPostList = [];
    if (boardName === "전체게시판") {
      try {
        boardList = await boardModel.findWithPopulate({}).populate({
          path: "postList",
          populate: [{ path: "board" }, { path: "owner" }],
        });
      } catch (error) {
        error.message = "게시판을 DB에서 찾는 과정에서 오류가 발생했습니다.";
        return next(error);
      }

      if (!boardList) {
        const error = new Error("게시판을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        return next(error);
      }

      boardList.forEach((board) => {
        if (board.postList.length !== 0) {
          totalPostList.push(...board.postList);
        }
      });
    } else {
      let board;
      try {
        board = await boardModel
          .findOneWithPopulate({
            name: boardName,
          })
          .populate({
            path: "postList",
            populate: [{ path: "board" }, { path: "owner" }],
          });

        if (!board) {
          const error = new Error("게시판을 DB에서 찾을 수 없습니다.");
          error.statusCode = 404;
          return next(error);
        }

        totalPostList = board.postList;
      } catch (error) {
        error.message = "게시판을 DB에서 찾는 과정에서 오류가 발생했습니다.";
        return next(error);
      }
    }

    let isBoardEmpty;
    const currPageNum = Number(pageNum);
    const firstPageNum = 1;
    let lastPageNum;
    const postList = [];
    if (totalPostList.length === 0) {
      isBoardEmpty = true;
      lastPageNum = 1;

      if (firstPageNum > currPageNum || currPageNum > lastPageNum) {
        const error = new Error("잘못된 접근입니다.");
        error.statusCode = 400;
        error.redirectURL = `/board/${boardName}/1`;
        throw error;
      }
    } else {
      isBoardEmpty = false;
      lastPageNum = Math.ceil(totalPostList.length / 10);

      if (firstPageNum > currPageNum || currPageNum > lastPageNum) {
        const error = new Error("잘못된 접근입니다.");
        error.statusCode = 400;
        error.redirectURL = `/board/${boardName}/1`;
        throw error;
      }

      if (boardName === "전체게시판") {
        totalPostList.sort((a, b) => b.seq - a.seq);
      } else {
        totalPostList.reverse();
        try {
          boardList = await boardModel.find({});
        } catch (error) {
          error.message = "게시판을 DB에서 찾는 과정에서 오류가 발생했습니다.";
          return next(error);
        }
      }

      // totalPostList에서 currPageNum(현재 페이지) 10개의 post를 postList에 넣는 로직
      for (let i = 0; i <= 9; i++) {
        if (totalPostList.length === (currPageNum - 1) * 10 + i) {
          break;
        }
        postList.push(totalPostList[(currPageNum - 1) * 10 + i]);
      }

      postList.forEach((post) => {
        post.createdTime = getCreatedTime(post.createdAt);
      });
    }

    const boardNameList = boardList.map((board) => board.name);

    return res.status(200).render("board/board", {
      pageTitle: "게시판",
      postList,
      selectedBoardName: boardName,
      currPageNum,
      firstPageNum,
      lastPageNum,
      isBoardEmpty,
      boardNameList,
    });
  }
}

const boardController = new BoardController();

export default boardController;
