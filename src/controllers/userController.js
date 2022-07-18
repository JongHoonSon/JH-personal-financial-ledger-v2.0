import User from "../models/User";

export const getProfile = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  const isMyProfile = res.locals.loggedInUser._id === userId ? true : false;

  res.render("user/profile", { pageTitle: "프로필", user, isMyProfile });
};

export const getEditProfile = (req, res) => {
  res.render("user/editProfile", {
    pageTitle: "프로필 수정",
  });
};

export const postEditProfile = (req, res) => {};
