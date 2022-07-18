import User from "../models/User";

export const getProfile = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  const isMyProfile = res.locals.loggedInUser._id === userId ? true : false;

  res.render("user/profile", { pageTitle: "프로필", user, isMyProfile });
};

export const getEditProfile = async (req, res) => {
  const { userId } = req.params;

  const loggedInUser = res.locals.loggedInUser;

  const user = await User.findById(userId);

  if (String(loggedInUser._id) !== String(user._id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  res.render("user/editProfile", {
    pageTitle: "프로필 수정",
    user,
  });
};

export const postEditProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, name, nickname, email } = req.body;

  const loggedInUser = res.locals.loggedInUser;

  const user = await User.findById(userId);

  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  if (String(loggedInUser._id) !== String(user._id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        name,
        nickname,
        email,
      },
      { new: true }
    );
    req.flash("success", "프로필을 수정했습니다.");
    req.session.user = updatedUser;
    return res.status(200).redirect(`/user/profile/${userId}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "프로필을 수정하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect(`/user/profile/${userId}`);
  }
};
