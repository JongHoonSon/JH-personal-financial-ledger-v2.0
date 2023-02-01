import { postModel } from "../../db/models";

const checkPostExist = async (req, res, next) => {
  const { postId } = req.params;

  const post = await postModel.findById(postId);

  if (!post) {
    const error = new Error("게시글이 DB에 존재하지 않습니다.");
    error.statusCode = 401;
    error.redirectURL = "/";
    throw error;
  }

  req.session.post = post;
  next();
};

export default checkPostExist;
