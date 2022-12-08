import User from "../models/User";
import Board from "../models/Board";
import Post from "../models/Post";

class PostController {
  async getAddPost(req, res) {
    const boardList = await Board.find({});
    const boardNameList = boardList
      .filter((board) => board.name !== "전체게시판")
      .map((board) => board.name);

    return res.status(200).render("post/add-post/add-post", {
      pageTitle: "글 작성",
      boardNameList,
    });
  }

  async postAddPost(req, res) {
    const { title, boardName, content } = req.body;

    console.log("req.body");
    console.log(req.body);

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    let totalBoard;
    let board;
    try {
      totalBoard = await Board.findOne({ name: "전체게시판" });
      board = await Board.findOne({ name: boardName });
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!totalBoard) {
      req.flash("error", "전체게시판을 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }
    if (!board) {
      req.flash("error", `${boardName} 게시판을 찾을 수 없습니다.`);
      return res.status(404).redirect("/");
    }

    try {
      const newPost = await Post.create({
        title,
        board,
        owner: user,
        content,
      });
      user.postList.push(newPost);
      totalBoard.postList.push(newPost);
      board.postList.push(newPost);
      await user.save();
      await totalBoard.save();
      await board.save();
      req.flash("success", "게시글을 작성하였습니다.");
      return res.status(200).redirect(`/post/detail/${newPost._id}`);
    } catch (error) {
      console.log(error);
      req.flash("error", "게시글을 작성하는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/post/add");
    }
  }

  async getEditPost(req, res) {
    const { postId } = req.params;

    let post;
    try {
      post = await Post.findById(postId).populate({
        path: "board",
        populate: "postList",
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/board/전체게시판/1");
    }
    if (!post) {
      req.flash("error", "게시글을 찾을 수 없습니다.");
      return { pass: false, return: res.status(404).redirect("/") };
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return { pass: false, return: res.status(404).redirect("/") };
    }

    if (String(post.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(403).redirect("/");
    }

    const boardList = await Board.find({});
    const boardNameList = boardList
      .filter((board) => board.name !== "전체게시판")
      .map((board) => board.name);

    return res.status(200).render("post/edit-post/edit-post", {
      pageTitle: "게시글 수정",
      post,
      boardNameList,
    });
  }

  async postEditPost(req, res) {
    const { postId } = req.params;
    const { title, boardName, content } = req.body;

    let post;
    try {
      post = await Post.findById(postId).populate({
        path: "board",
        populate: "postList",
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/board/전체게시판/1");
    }
    if (!post) {
      req.flash("error", "게시글을 찾을 수 없습니다.");
      return { pass: false, return: res.status(404).redirect("/") };
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return { pass: false, return: res.status(404).redirect("/") };
    }

    if (String(post.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(403).redirect("/");
    }

    try {
      post.board.postList = post.board.postList.filter((el) => {
        if (String(el._id) !== String(post.id)) {
          return true;
        }
      });
      await post.board.save();

      const board = await Board.findOne({ name: boardName });
      board.postList.push(post);
      await board.save();

      post.title = title;
      post.board = board;
      post.content = content;
      await post.save();

      req.flash("success", "게시글을 수정했습니다.");
      return res.status(200).redirect(`/post/detail/${postId}`);
    } catch (error) {
      console.log(error);
      req.flash("error", "게시글을 수정하는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect(`/post/edit/${postId}`);
    }
  }

  async postDeletePost(req, res) {
    const { postId } = req.params;

    let post;
    try {
      post = await Post.findById(postId).populate({
        path: "board",
        populate: "postList",
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/board/전체게시판/1");
    }
    if (!post) {
      req.flash("error", "게시글을 찾을 수 없습니다.");
      return { pass: false, return: res.status(404).redirect("/") };
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return { pass: false, return: res.status(404).redirect("/") };
    }

    if (String(post.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(403).redirect("/");
    }

    try {
      user.postList = user.postList.filter((el) => {
        if (String(el._id) !== String(post.id)) {
          return true;
        }
      });
      await user.save();

      const totalBoard = await Board.findOne({ name: "전체게시판" });
      if (!totalBoard) {
        req.flash("error", "전체게시판을 찾을 수 없습니다.");
        return res.status(404).redirect("/");
      }

      totalBoard.postList = totalBoard.postList.filter((el) => {
        if (String(el._id) !== String(post.id)) {
          return true;
        }
      });
      await totalBoard.save();

      post.board.postList = post.board.postList.filter((el) => {
        if (String(el._id) !== String(post.id)) {
          return true;
        }
      });
      await post.board.save();

      await Post.findByIdAndDelete(postId);

      req.flash("success", "게시글을 삭제했습니다.");
      if (req.session.logHistory.prevPageURL) {
        return res.status(200).json(req.session.history.prevPageURL);
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "게시글을 삭제하는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect(`/post/detail/${postId}`);
    }
  }

  async getDetailPost(req, res) {
    const { postId } = req.params;

    let post;
    try {
      post = await Post.findById(postId)
        .populate("board")
        .populate("owner")
        .populate({
          path: "commentList",
          populate: { path: "owner" },
        });
    } catch (error) {
      console.log(error);
      req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/board/전체게시판/1");
    }
    if (!post) {
      req.flash("error", "게시글을 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    const user = req.session.user;

    let alreadyLiked = false;

    for (let i = 0; i < post.likesUserList.length; i++) {
      if (String(post.likesUserList[i]._id) === String(user._id)) {
        alreadyLiked = true;
        break;
      }
    }

    return res.status(200).render("post/detail-post/detail-post", {
      pageTitle: "글 상세보기",
      post,
      alreadyLiked,
    });
  }

  async postIncreaseViewsPost(req, res) {
    const { postId } = req.params;

    try {
      const post = await Post.findById(postId);
      post.views += 1;
      await post.save();
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      req.flash(
        "error",
        "게시글의 조회수를 증가시키는 과정에서 오류가 발생했습니다."
      );
      return res.status(500).redirect("/board/전체게시판/1");
    }
  }

  async postToggleLikesPost(req, res) {
    const { postId } = req.params;

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    let post;
    try {
      post = await Post.findById(postId).populate("likesUserList");
    } catch (error) {
      console.log(error);
      req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/board/전체게시판/1");
    }
    if (!post) {
      req.flash("error", "게시글을 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    let alreadyIn = false;
    let indexInLikesUserList;

    for (let i = 0; i < post.likesUserList.length; i++) {
      if (String(post.likesUserList[i]._id) === String(user._id)) {
        alreadyIn = true;
        indexInLikesUserList = i;
        break;
      }
    }

    if (alreadyIn) {
      try {
        post.likesUserList.splice(indexInLikesUserList, 1);
        await post.save();
      } catch (error) {
        console.log(error);
        req.flash(
          "error",
          "게시글 정보를 갱신하는 과정에서 오류가 발생했습니다."
        );
        return res.status(500).redirect("/board/전체게시판/1");
      }

      try {
        let indexInPostList;
        user.likesPostList.forEach((post, index) => {
          if (String(post._id) === postId) {
            indexInPostList = index;
          }
        });
        user.likesPostList.splice(indexInPostList, 1);
        await user.save();
      } catch (error) {
        console.log(error);
        req.flash(
          "error",
          "유저 정보를 갱신하는 과정에서 오류가 발생했습니다."
        );
        return res.status(500).redirect("/board/전체게시판/1");
      }

      req.flash("success", "좋아요 취소 완료");
      return res.sendStatus(200);
    } else {
      try {
        post.likesUserList.push(user);
        await post.save();
      } catch (error) {
        console.log(error);
        req.flash(
          "error",
          "게시글 정보를 갱신하는 과정에서 오류가 발생했습니다."
        );
        return res.status(500).redirect("/board/전체게시판/1");
      }

      try {
        user.likesPostList.push(post);
        await user.save();
      } catch (error) {
        console.log(error);
        req.flash(
          "error",
          "유저 정보를 갱신하는 과정에서 오류가 발생했습니다."
        );
        return res.status(500).redirect("/board/전체게시판/1");
      }

      req.flash("success", "좋아요 완료");
      return res.sendStatus(200);
    }
  }
}

const postController = new PostController();

export default postController;
