import { postModel } from "../../db/models";

const checkPostExist = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const post = await postModel.findById(postId);
    req.session.post = post;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkPostExist;
