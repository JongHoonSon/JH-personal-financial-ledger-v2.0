import User from "../models/User";
import Board from "../models/Board";
import Post from "../models/Post";

export const getAddPost = (req, res) => {
  res.status(200).render("post/addPost", { pageTitle: "글 작성" });
};

export const postAddPost = async (req, res) => {
  const { title, boardName, content } = req.body;

  console.log("title, boardName, content");
  console.log(title, boardName, content);

  const loggedInUser = req.session.user;
  const user = await User.findById(loggedInUser._id);

  const totalBoard = await Board.findOne({ name: "전체게시판" });
  const board = await Board.findOne({ name: boardName });

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
    req.flash("success", "글을 작성하였습니다.");
    return res.status(200).redirect("/post/add");
  } catch (error) {
    console.log(error);
    req.flash("error", "글을 작성하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect("/post/add");
  }
};

export const getEditPost = (req, res) => {
  res.status(200).render("post/editPost", { pageTitle: "글 수정" });
};

export const postEditPost = async (req, res) => {};

export const postDeletePost = async (req, res) => {};

export const getDetailPost = async (req, res) => {
  const { postId } = req.params;

  console.log("postId");
  console.log(postId);

  try {
    const post = await Post.findById(postId)
      .populate("board")
      .populate("owner")
      .populate({
        path: "commentList",
        populate: { path: "owner" },
      });

    console.log("post");
    console.log(post);

    return res
      .status(200)
      .render("post/detailPost", { pageTitle: "글 상세보기", post });
  } catch (error) {
    console.log(error);
    req.flash("error", "글을 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect("/board/전체게시판/1");
  }
};

export const postIncreaseViewsPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    post.views += 1;
    await post.save();
    return sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};
