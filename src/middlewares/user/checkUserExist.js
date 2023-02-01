import { userModel } from "../../db/models";

const checkUserExist = async (req, res, next) => {
  if (req.session.loggedIn) {
    const { user } = req.session;

    try {
      const loggedInUser = await userModel.findById(user._id);

      if (!loggedInUser) {
        const error = new Error("로그인한 계정이 DB에 존재하지 않습니다.");
        error.statusCode = 404;
        error.redirectURL = "/";
        next(error);
      }

      req.session.loggedInUser = loggedInUser;
    } catch (error) {
      next(error);
    }

    next();
  }
};

export default checkUserExist;
