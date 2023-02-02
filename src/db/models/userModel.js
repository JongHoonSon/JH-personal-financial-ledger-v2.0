import mongoose from "mongoose";
import { userSchema } from "../schemas";

const User = mongoose.model("User", userSchema);

class UserModel {
  create(params) {
    try {
      return User.create(params);
    } catch (error) {
      error.message = "유저를 생성하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }

  async findOne(params) {
    try {
      const user = await User.findOne(params);

      if (!user) {
        const error = new Error("유저를 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async findById(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        const error = new Error("유저를 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async exists(params) {
    try {
      const isExist = await User.exists(params);
      return isExist;
    } catch (error) {
      error.message = "유저를 찾는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }

  findByIdWithPopulate(userId) {
    return User.findById(userId);
  }
}

const userModel = new UserModel();

export default userModel;
