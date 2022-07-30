import User from "../models/User";
import Board from "../models/Board";
import Post from "../models/Post";
import { unauthorizedAccess } from "../middlewares";

export const getAddPost = (req, res) => {
  res.status(200).render("post/addPost", { pageTitle: "글 작성" });
};

export const postAddPost = async (req, res) => {
  const { title, boardName, content } = req.body;

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

export const getEditPost = async (req, res) => {
  const { postId } = req.params;

  const checkResult = await checkPostOwnerIsLoggedInUser(req, res, postId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const post = checkResult.post;

  res.status(200).render("post/editPost", { pageTitle: "게시글 수정", post });
};

export const postEditPost = async (req, res) => {
  const { postId } = req.params;
  const { title, boardName, content } = req.body;

  const checkResult = await checkPostOwnerIsLoggedInUser(req, res, postId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const post = checkResult.post;

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
    return res.redirect(`/post/edit/${postId}`);
  }
};

export const postDeletePost = async (req, res) => {};

export const getDetailPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("board")
      .populate("owner")
      .populate({
        path: "commentList",
        populate: { path: "owner" },
      });

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
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
};

export const postIncreaseLikesPost = async (req, res) => {
  const { postId } = req.params;

  const loggedInUser = res.locals.loggedInUser;
  const user = await User.findById(loggedInUser._id);

  try {
    const post = await Post.findById(postId).populate("likesUserList");

    // console.log("post.likesUserList");
    // console.log(post.likesUserList);

    let alreadyIn = false;

    for (let i = 0; i < post.likesUserList.length; i++) {
      if (String(post.likesUserList[i]._id) === String(user._id)) {
        alreadyIn = true;
        break;
      }
    }

    if (alreadyIn) {
      req.flash("error", "이미 이 게시글의 좋아요를 눌렀습니다.");
      return res.status(400).redirect(`/post/detail/${postId}`);
    } else {
      post.likesUserList.push(user);
      await post.save();

      user.likesPostList.push(post);
      await user.save();

      req.flash("success", "좋아요 완료");
      return res.status(200).redirect(`/post/detail/${postId}`);
    }
  } catch (error) {
    console.log(error);
  }
};

const checkPostOwnerIsLoggedInUser = async (req, res, postId) => {
  const post = await Post.findById(postId).populate({
    path: "board",
    populate: "postList",
  });

  if (!post) {
    req.flash("error", "게시글을 찾을 수 없습니다.");
    return { pass: false, return: res.status(404).redirect("/") };
  }

  const loggedInUser = req.session.user;
  const user = await User.findById(loggedInUser._id);

  console.log(String(post.owner._id) !== String(user._id));

  if (String(post.owner._id) !== String(user._id)) {
    return { pass: false, return: unauthorizedAccess(req, res) };
  }

  return { pass: true, post: post, user: user };
};
