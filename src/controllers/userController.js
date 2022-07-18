import User from "../models/User";

export const getProfile = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  console.log("user");
  console.log(user);

  res.render("user/profile", { pageTitle: "프로필", user });
};

export const getEditProfile = (req, res) => {
  res.render("user/editProfile", {
    pageTitle: "프로필 수정",
  });
};

export const postEditProfile = (req, res) => {};
