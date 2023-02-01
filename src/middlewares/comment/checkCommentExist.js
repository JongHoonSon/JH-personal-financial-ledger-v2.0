import { commentModel } from "../../db/models";

const checkCommentExist = async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    const error = new Error("댓글이 DB에 존재하지 않습니다.");
    error.statusCode = 401;
    error.redirectURL = "/";
    throw error;
  }

  req.session.comment = comment;
  next();
};

export default checkCommentExist;
