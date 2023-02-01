import { userModel } from "../../db/models";

const checkUserExist = async (req, res, next) => {
  if (req.session.loggedIn) {
    const { user } = req.session;

    try {
      const loggedInUser = await userModel.findById(user._id);
      req.session.loggedInUser = loggedInUser;
      next();
    } catch (error) {
      next(error);
    }
  }
};

export default checkUserExist;
