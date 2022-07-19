import { unauthorizedAccess } from "../middlewares";
import User from "../models/User";
import bcrypt from "bcrypt";

export const getProfile = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  const isMyProfile = req.session.user._id === userId ? true : false;

  res.render("user/profile", { pageTitle: "프로필", user, isMyProfile });
};

export const getEditProfile = async (req, res) => {
  const { userId } = req.params;

  const checkResult = await checkUserIsLoggedInUser(req, res, userId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const user = checkResult.user;

  res.render("user/editProfile", {
    pageTitle: "프로필 수정",
    user,
  });
};

export const postEditProfile = async (req, res) => {
  const { userId } = req.params;
  const { username, name, nickname, email } = req.body;

  const checkResult = await checkUserIsLoggedInUser(req, res, userId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const existedUsername = await User.exists({ username });

  if (existedUsername) {
    req.flash("error", "이미 사용 중인 아이디입니다.");
    return res.status(400).redirect("/join");
  }

  const existedEmail = await User.exists({ email });
  if (existedEmail) {
    req.flash("error", "이미 사용 중인 이메일입니다.");
    return res.status(400).redirect("/join");
  }

  const existedNickname = await User.exists({ nickname });
  if (existedNickname) {
    req.flash("error", "이미 사용 중인 닉네임입니다.");
    return res.status(400).redirect("/join");
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
    req.session.user = updatedUser;
    req.flash("success", "프로필을 수정했습니다.");
    return res.status(200).redirect(`/user/profile/${userId}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "프로필을 수정하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect(`/user/profile/${userId}`);
  }
};

export const getEditPassword = async (req, res) => {
  const { userId } = req.params;

  const checkResult = await checkUserIsLoggedInUser(req, res, userId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  res.render("user/editPassword", { pageTitle: "비밀번호 변경" });
};

export const postEditPassword = async (req, res) => {
  const { userId } = req.params;
  const { password, new_password, new_password_confirm } = req.body;

  const checkResult = await checkUserIsLoggedInUser(req, res, userId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const user = checkResult.user;

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    req.flash("error", "비밀번호가 일치하지 않습니다.");
    return res.status(400).redirect(`/user/edit-password/${userId}`);
  }

  if (new_password !== new_password_confirm) {
    req.flash(
      "error",
      "입력하신 새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다."
    );
    return res.status(400).redirect(`/user/edit-password/${userId}`);
  }

  try {
    user.password = new_password;
    await user.save();
    req.session.user = user;
    req.flash("success", "비밀번호를 변경했습니다.");
    return res.status(200).redirect(`/user/profile/${userId}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "비밀번호를 변경하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect(`/user/edit-password/${userId}`);
  }
};

const checkUserIsLoggedInUser = async (req, res, userId) => {
  const loggedInUser = req.session.user;

  const user = await User.findById(userId);

  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return { pass: false, return: res.status(404).redirect("/") };
  }

  if (String(loggedInUser._id) !== String(user._id)) {
    return { pass: false, return: unauthorizedAccess(req, res) };
  }

  return { pass: true, user: user };
};
