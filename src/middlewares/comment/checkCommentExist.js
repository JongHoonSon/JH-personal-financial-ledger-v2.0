import { commentModel } from "../../db/models";

const checkCommentExist = async (req, res, next) => {
  const { commentId } = req.params;

  try {
    const comment = await commentModel.findById(commentId);
    req.session.comment = comment;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkCommentExist;
