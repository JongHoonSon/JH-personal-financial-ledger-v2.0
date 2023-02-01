import mongoose from "mongoose";
import { postSchema } from "../schemas";

const Post = mongoose.model("Post", postSchema);

class PostModel {
  create(params) {
    return Post.create(params);
  }

  async find(params) {
    try {
      const post = await Post.find(params);

      if (!post) {
        const error = new Error("게시물을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return post;
    } catch (error) {
      throw error;
    }
  }

  async findById(postId) {
    try {
      const post = await Post.findById(postId);

      if (!post) {
        const error = new Error("게시물을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return post;
    } catch (error) {
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
