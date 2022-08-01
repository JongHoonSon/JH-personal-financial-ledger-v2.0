import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { unauthorizedAccess } from "../middlewares";

export const postAddComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const loggedInUser = req.session.user;
  let user;
  try {
    user = await User.findById(loggedInUser._id).populate("commentList");
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
    post = await Post.findById(postId).populate("commentList");
  } catch (error) {
    console.log(error);
    req.flash("error", "게시글을 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!post) {
    req.flash("error", "게시글을 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  try {
    const comment = await Comment.create({ owner: user, content, post });

    user.commentList.push(comment);
    await user.save();

    post.commentList.push(comment);
    await post.save();

    req.flash("success", "댓글을 생성했습니다.");
    return res.status(200).redirect(`/post/detail/${postId}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "댓글을 생성하는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect(`/post/detail/${postId}`);
  }
};

export const postEditComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  const checkResult = await checkCommentOwnerIsLoggedInUser(
    req,
    res,
    commentId
  );

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const comment = checkResult.comment;

  try {
    comment.content = content;
    await comment.save();

    req.flash("success", "댓글을 수정했습니다.");
    return res.status(200).redirect(`/post/detail/${postId}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "댓글을 수정하는 과정에서 오류가 발생했습니다.");
    return res.status(200).redirect(`/post/detail/${postId}`);
  }
};

export const postDeleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  const checkResult = await checkCommentOwnerIsLoggedInUser(
    req,
    res,
    commentId
  );

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const comment = checkResult.comment;
  const user = checkResult.user;

  try {
    user.commentList = user.commentList.filter((el) => {
      if (String(el._id) !== String(comment._id)) {
        return true;
      }
    });
    await user.save();

    const post = await Post.findById(postId).populate("commentList");
    if (!post) {
      req.flash("error", "게시글을 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }
    post.commentList = post.commentList.filter((el) => {
      if (String(el._id) !== String(comment._id)) {
        return true;
      }
    });
    await post.save();

    await Comment.findByIdAndDelete(commentId);

    req.flash("success", "댓글을 삭제했습니다.");
    return res.status(200).redirect(`/post/detail/${postId}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "댓글을 삭제하는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect(`/post/detail/${postId}`);
  }
};

export const postIncreaseLikesComment = async (req, res) => {
  const { postId, commentId } = req.params;

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

  let comment;
  try {
    comment = await Comment.findById(commentId).populate("likesUserList");
  } catch (error) {
    console.log(error);
    req.flash("error", "댓글을 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect(`/post/detail/${postId}`);
  }
  if (!comment) {
    req.flash("error", "댓글을 찾을 수 없습니다.");
    return res.status(404).redirect(`/post/detail/${postId}`);
  }

  let alreadyIn = false;

  for (let i = 0; i < comment.likesUserList.length; i++) {
    if (String(comment.likesUserList[i]._id) === String(user._id)) {
      alreadyIn = true;
      break;
    }
  }

  if (alreadyIn) {
    req.flash("error", "이미 이 댓글의 좋아요를 눌렀습니다.");
    return res.status(200).redirect(`/post/detail/${postId}`);
  } else {
    try {
      comment.likesUserList.push(user);
      await comment.save();
    } catch (error) {
      console.log(error);
      req.flash("error", "댓글 정보를 갱신하는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect(`/post/detail/${postId}`);
    }

    try {
      user.likesCommentList.push(comment);
      await user.save();
    } catch (error) {
      console.log(error);
      req.flash("error", "유저 정보를 갱신하는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect(`/post/detail/${postId}`);
    }

    req.flash("success", "좋아요 완료");
    return res.status(200).redirect(`/post/detail/${postId}`);
  }
};

const checkCommentOwnerIsLoggedInUser = async (req, res, commentId) => {
  let comment;
  try {
    comment = await Comment.findById(commentId).populate({
      path: "owner",
      populate: "commentList",
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "댓글을 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/board/전체게시판/1");
  }
  if (!comment) {
    req.flash("error", "댓글을 찾을 수 없습니다.");
    return { pass: false, return: res.status(404).redirect("/") };
  }

  const loggedInUser = req.session.user;
  let user;
  try {
    user = await User.findById(loggedInUser._id).populate("commentList");
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return { pass: false, return: res.status(404).redirect("/") };
  }

  if (String(comment.owner._id) !== String(user._id)) {
    return { pass: false, return: unauthorizedAccess(req, res) };
  }

  return { pass: true, comment: comment, user: user };
};
