import { userModel } from "../db/models";

const checkUserExist = (req, res, next) => {
  if (req.session.loggedIn) {
    const loggedInUser = req.session.user;

    try {
      const isLoggedInUserExist = userModel.findById(loggedInUser._id);

      if (!isLoggedInUserExist) {
        const error = new Error("로그인한 계정이 DB에 존재하지 않습니다.");
        error.statusCode = 401;
        error.redirectURL = "/";
        throw error;
      }
    } catch (error) {
      throw error;
    }

    next();
  }
};

export default checkUserExist;
