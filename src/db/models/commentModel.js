import mongoose from "mongoose";
import { commentSchema } from "../schemas";

const Comment = mongoose.model("Comment", commentSchema);

class CommentModel {
  async create(params) {
    try {
      const comment = await Comment.create(params);
      return comment;
    } catch (error) {
      throw error;
    }
  }

  findByIdWithPopulate(commentId) {
    return Comment.findById(commentId);
  }

  async findByIdAndDelete(commentId) {
    try {
      await Comment.findByIdAndDelete(commentId);
    } catch (error) {
      throw error;
    }
  }
}

const commentModel = new CommentModel();

export default commentModel;
