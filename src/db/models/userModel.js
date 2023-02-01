import mongoose from "mongoose";
import { userSchema } from "../schemas";

const User = mongoose.model("User", userSchema);

class UserModel {
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

  findByIdWithPopulate(userId) {
    return User.findById(userId);
  }
}

const userModel = new UserModel();

export default userModel;
