import mongoose from "mongoose";
import { postSchema } from "../schemas";

const Post = mongoose.model("Post", postSchema);

class PostModel {
  async create(params) {
    try {
      const post = await Post.create(params);
      return post;
    } catch (error) {
      error.message = "게시글을 DB에 생성하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }

  async findById(postId) {
    try {
      const post = await Post.findById(postId);

      if (!post) {
        const error = new Error("게시글을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return post;
    } catch (error) {
      error.message = "게시글을 DB에서 찾는 과정에서 에러가 발생했습니다.";
      throw error;
    }
  }

  findByIdWithPopulate(postId) {
    return Post.findById(postId);
  }

  findByIdAndDelete(postId) {
    return Post.findByIdAndDelete(postId);
  }
}

const postModel = new PostModel();

export default postModel;
