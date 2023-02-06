import mongoose from "mongoose";
import { commentSchema } from "../schemas";

const Comment = mongoose.model("Comment", commentSchema);

class CommentModel {
  async create(params) {
    try {
      const comment = await Comment.create(params);
      return comment;
    } catch (error) {
      error.messageToShow =
        "댓글을 DB에 생성하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }

  async findById(commentId) {
    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        const error = new Error("댓글을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return comment;
    } catch (error) {
      error.messageToShow = "댓글을 DB에서 찾는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }

  findByIdWithPopulate(commentId) {
    return Comment.findById(commentId);
  }

  async findByIdAndDelete(commentId) {
    try {
      await Comment.findByIdAndDelete(commentId);
      return;
    } catch (error) {
      error.messageToShow =
        "댓글을 DB에서 삭제하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }
}

const commentModel = new CommentModel();

export default commentModel;
