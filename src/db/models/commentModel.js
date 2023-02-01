import mongoose from "mongoose";
import { commentSchema } from "../schemas";

const Comment = mongoose.model("Comment", commentSchema);

class CommentModel {
  create(params) {
    return Comment.create(params);
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
      throw error;
    }
  }

  findByIdWithPopulate(commentId) {
    return Comment.findById(commentId);
  }

  findByIdAndDelete(commentId) {
    return Comment.findByIdAndDelete(commentId);
  }
}

const commentModel = new CommentModel();

export default commentModel;
