import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";

export const postAddComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  const loggedInUser = req.session.user;
  let user;
  try {
    user = await User.findById(loggedInUser._id).populate("commentList");
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 에러가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  let post;
  try {
    post = await Post.findById(postId).populate("commentList");
  } catch (error) {
    console.log(error);
    req.flash("error", "게시글을 찾을 수 없습니다.");
    return res.status(500).redirect("/");
  }
  if (!post) {
    req.flash("error", "게시글을 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

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
