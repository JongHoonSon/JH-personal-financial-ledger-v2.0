import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";

export const postAddComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  console.log("postId");
  console.log(postId);

  console.log("content");
  console.log(content);

  const loggedInUser = res.locals.loggedInUser;
  const user = await User.findById(loggedInUser._id).populate("commentList");

  const post = await Post.findById(postId).populate("commentList");

  try {
    const comment = await Comment.create({ owner: user, content, post });

    user.commentList.push(comment);
    await post.save();

    post.commentList.push(comment);
    await post.save();

    req.flash("success", "댓글을 생성했습니다.");
    return res.status(200).redirect(`/post/detail/${postId}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "댓글을 생성하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect(`/post/detail/${postId}`);
  }
};
