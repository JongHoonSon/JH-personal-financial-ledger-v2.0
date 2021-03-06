import User from "../models/User";
import Post from "../models/Post";

export const getBoard = async (req, res) => {
  const { category } = req.params;

  const postList = await Post.find({ category });

  console.log("postList");
  console.log(postList);

  res.status(200).render("board/board", { pageTitle: "게시판", postList });
};

export const getAddPost = (req, res) => {
  res.status(200).render("board/addPost", { pageTitle: "글 작성" });
};

export const postAddPost = async (req, res) => {
  const { title, category, content } = req.body;

  console.log("title, category, content");
  console.log(title, category, content);

  const loggedInUser = req.session.user;
  const user = await User.findById(loggedInUser._id);

  try {
    const newPost = await Post.create({
      title,
      category,
      owner: user,
      content,
    });
    user.postList.push(newPost);
    user.save();
    req.flash("success", "글을 작성하였습니다.");
    return res.status(200).redirect("/board/add-post");
  } catch (error) {
    console.log(error);
    req.flash("error", "글을 작성하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect("/board/add-post");
  }
};

export const getEditPost = (req, res) => {
  res.status(200).render("board/editPost", { pageTitle: "글 수정" });
};

export const postEditPost = async (req, res) => {};

export const postDeletePost = async (req, res) => {};
