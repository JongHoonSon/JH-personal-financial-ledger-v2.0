import { checkCommentOwner } from "../middlewares";
import { userModel, postModel, commentModel } from "./../db/models";

class CommentController {
  async addComment(req, res, next) {
    const { postId } = req.params;
    const { content } = req.body;

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("commentList");
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    let post;
    try {
      post = await postModel
        .findByIdWithPopulate(postId)
        .populate("commentList");
    } catch (error) {
      error.messageToShow =
        "게시글을 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    try {
      const comment = await commentModel.create({ owner: user, content, post });

      user.commentList.push(comment);
      await user.save();

      post.commentList.push(comment);
      await post.save();

      req.flash("success", "댓글을 생성했습니다.");
      return res.status(200).redirect(`/post/${postId}`);
    } catch (error) {
      error.messageToShow = "댓글을 생성하는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }
  }

  async editComment(req, res, next) {
    const { commentId } = req.params;
    const { newContent } = req.body;

    let comment;
    try {
      comment = await commentModel.findByIdWithPopulate(commentId).populate({
        path: "owner",
        populate: "commentList",
      });
    } catch (error) {
      error.messageToShow = "댓글을 DB에서 찾는 과정에서 오류가 발생했습니다.";
      error.redirectURL = "/board/전체게시판/1";
      next(error);
      return;
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("commentList");
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { isOwner } = checkCommentOwner(comment, user, next);
    if (!isOwner) return;

    try {
      comment.content = newContent;
      await comment.save();

      req.flash("success", "댓글을 수정했습니다.");
      return res.status(200).json(`/post/${comment.post._id}`);
    } catch (error) {
      error.messageToShow = "댓글을 수정하는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }
  }

  async deleteComment(req, res, next) {
    const { commentId } = req.params;

    let comment;
    try {
      comment = await commentModel
        .findByIdWithPopulate(commentId)
        .populate("post");
    } catch (error) {
      error.messageToShow = "댓글을 DB에서 찾는 과정에서 오류가 발생했습니다.";
      error.redirectURL = "/board/전체게시판/1";
      next(error);
      return;
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("commentList");
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { isOwner } = checkCommentOwner(comment, user, next);
    if (!isOwner) return;

    user.commentList = user.commentList.filter(
      (el) => String(el._id) !== String(comment._id)
    );

    try {
      await user.save();
    } catch (error) {
      error.messageToShow =
        "유저 정보를 DB에 저장하는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    let post;
    try {
      post = await postModel
        .findByIdWithPopulate(comment.post._id)
        .populate("commentList");

      if (!post) {
        const error = new Error("게시글을 찾을 수 없습니다.");
        error.statusCode = 404;
        error.redirectURL = "/board/전체게시판/1";
        next(error);
        return;
      }
    } catch (error) {
      error.messageToShow =
        "게시글을 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    post.commentList = post.commentList.filter(
      (el) => String(el._id) !== String(comment._id)
    );
    try {
      await post.save();
    } catch (error) {
      error.messageToShow =
        "게시글을 DB에 저장하는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    try {
      await commentModel.findByIdAndDelete(commentId);
      req.flash("success", "댓글을 삭제했습니다.");
      return res.status(200).json(`/post/${post._id}`);
    } catch (error) {
      next(error);
      return;
    }
  }

  async increaseCommentLikes(req, res, next) {
    const { commentId } = req.params;

    const user = req.session.loggedInUser;

    let comment;
    try {
      comment = await commentModel
        .findByIdWithPopulate(commentId)
        .populate("likesUserList");

      if (!comment) {
        const error = new Error("댓글을 찾을 수 없습니다.");
        error.statusCode = 404;
        error.redirectURL = "/board/전체게시판/1";
        next(error);
        return;
      }
    } catch (error) {
      error.messageToShow = "댓글을 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
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
      return res.status(200).json(`/post/${comment.post._id}`);
    } else {
      try {
        comment.likesUserList.push(user);
        await comment.save();
      } catch (error) {
        error.messageToShow =
          "댓글을 DB에 저장하는 과정에서 오류가 발생했습니다.";
        error.redirectURL = "/board/전체게시판/1";
        next(error);
        return;
      }

      try {
        user.likesCommentList.push(comment);
        await user.save();
      } catch (error) {
        error.messageToShow =
          "댓글을 DB에 저장하는 과정에서 오류가 발생했습니다.";
        error.redirectURL = "/board/전체게시판/1";
        next(error);
        return;
      }

      req.flash("success", "좋아요 완료");
      return res.status(200).json(`/post/${comment.post._id}`);
    }
  }
}

const commentController = new CommentController();

export default commentController;
