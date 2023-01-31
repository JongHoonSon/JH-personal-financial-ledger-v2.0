import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";

class CommentController {
  async addComment(req, res) {
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
      return res.status(200).redirect(`/post/${postId}`);
    } catch (error) {
      console.log(error);
      req.flash("error", "댓글을 생성하는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect(`/post/${postId}`);
    }
  }

  async editComment(req, res) {
    const { commentId } = req.params;
    const { newContent } = req.body;

    let comment;
    try {
      comment = await Comment.findById(commentId).populate({
        path: "owner",
        populate: "commentList",
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "댓글을 불러오는 과정에서 오류가 발생했습니다.");
      return res
        .status(500)
        .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
    }
    if (!comment) {
      req.flash("error", "댓글을 찾을 수 없습니다.");
      return res
        .status(404)
        .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id).populate("commentList");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }

    if (String(comment.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }

    try {
      comment.content = newContent;
      await comment.save();

      req.flash("success", "댓글을 수정했습니다.");
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      req.flash("error", "댓글을 수정하는 과정에서 오류가 발생했습니다.");
      return res
        .status(500)
        .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
    }
  }

  async deleteComment(req, res) {
    const { postId, commentId } = req.params;

    let comment;
    try {
      comment = await Comment.findById(commentId).populate({
        path: "owner",
        populate: "commentList",
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "댓글을 불러오는 과정에서 오류가 발생했습니다.");
      return res
        .status(500)
        .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
    }
    if (!comment) {
      req.flash("error", "댓글을 찾을 수 없습니다.");
      return res
        .status(404)
        .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id).populate("commentList");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }

    if (String(comment.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }

    try {
      user.commentList = user.commentList.filter(
        (el) => String(el._id) !== String(comment._id)
      );
      await user.save();

      const post = await Post.findById(postId).populate("commentList");
      if (!post) {
        req.flash("error", "게시글을 찾을 수 없습니다.");
        return res
          .status(404)
          .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
      }
      post.commentList = post.commentList.filter(
        (el) => String(el._id) !== String(comment._id)
      );
      await post.save();

      await Comment.findByIdAndDelete(commentId);

      req.flash("success", "댓글을 삭제했습니다.");
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      req.flash("error", "댓글을 삭제하는 과정에서 오류가 발생했습니다.");
      return res
        .status(500)
        .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
    }
  }

  async increaseCommentLikes(req, res) {
    const { commentId } = req.params;

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).json({ haveToRedirect: true, redirectURL: "/" });
    }

    let comment;
    try {
      comment = await Comment.findById(commentId).populate("likesUserList");
    } catch (error) {
      console.log(error);
      req.flash("error", "댓글을 불러오는 과정에서 오류가 발생했습니다.");
      return res
        .status(500)
        .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
    }
    if (!comment) {
      req.flash("error", "댓글을 찾을 수 없습니다.");
      return res
        .status(404)
        .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
    }

    let alreadyLikesThisComment = false;
    for (let i = 0; i < comment.likesUserList.length; i++) {
      if (String(comment.likesUserList[i]._id) === String(user._id)) {
        alreadyLikesThisComment = true;
        break;
      }
    }

    if (alreadyLikesThisComment) {
      req.flash("error", "이미 이 댓글의 좋아요를 눌렀습니다.");
      return res.sendStatus(200);
    } else {
      try {
        comment.likesUserList.push(user);
        await comment.save();
      } catch (error) {
        console.log(error);
        req.flash(
          "error",
          "댓글 정보를 갱신하는 과정에서 오류가 발생했습니다."
        );
        return res
          .status(500)
          .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
      }

      try {
        user.likesCommentList.push(comment);
        await user.save();
      } catch (error) {
        console.log(error);
        req.flash(
          "error",
          "유저 정보를 갱신하는 과정에서 오류가 발생했습니다."
        );
        return res
          .status(500)
          .json({ haveToRedirect: true, redirectURL: "/board/전체게시판/1" });
      }

      req.flash("success", "좋아요 완료");
      return res.sendStatus(200);
    }
  }
}

const commentController = new CommentController();

export default commentController;
