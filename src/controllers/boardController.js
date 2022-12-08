import Board from "../models/Board";
import { getCreatedTime } from "../utils";

class BoardController {
  async getBoard(req, res) {
    const { boardName, pageNum } = req.params;

    let boardList;
    let totalPostList = [];

    if (boardName === "전체게시판") {
      boardList = await Board.find({}).populate({
        path: "postList",
        populate: [{ path: "board" }, { path: "owner" }],
      });

      boardList.forEach((board) => {
        if (board.postList.length !== 0) {
          totalPostList.push(...board.postList);
        }
      });
    } else {
      let board;
      try {
        board = await Board.findOne({
          name: boardName,
        }).populate({
          path: "postList",
          populate: [{ path: "board" }, { path: "owner" }],
        });
        totalPostList = board.postList;
      } catch (error) {
        console.log(error);
        req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
        return res.status(500).redirect("/");
      }
      if (!board) {
        req.flash("error", "게시판을 찾을 수 없습니다.");
        return res.status(404).redirect("/");
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
    } else {
      isBoardEmpty = false;
      lastPageNum = Math.ceil(totalPostList.length / 10);

      if (boardName === "전체게시판") {
        totalPostList.sort((a, b) => b.seq - a.seq);
      } else {
        totalPostList.reverse();
        boardList = await Board.find({});
      }

      // totalPostList에서 currPageNum(현재 페이지) 10개의 post를 postList에 넣는 로직
      for (let i = 0; i <= 9; i++) {
        if (totalPostList.length === (currPageNum - 1) * 10 + i) {
          break;
        }
        postList.push(totalPostList[(currPageNum - 1) * 10 + i]);
      }

      postList.forEach((post) => {
        post.dateGap = getCreatedTime(post.createdAt);
      });
    }

    const boardNameList = boardList.map((board) => board.name);

    if (firstPageNum > currPageNum || currPageNum > lastPageNum) {
      req.flash("error", "잘못된 접근입니다.");
      return res.status(404).redirect(`/board/${boardName}/1`);
    }

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
