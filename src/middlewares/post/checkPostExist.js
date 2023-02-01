import { postModel } from "../../db/models";

const checkPostExist = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await postModel.findById(postId);

    if (!post) {
      const error = new Error("게시글이 DB에 존재하지 않습니다.");
      error.statusCode = 404;
      next(error);
    }

    req.session.post = post;
  } catch (error) {
    next(error);
  }
  next();
};

export default checkPostExist;
