import { unauthorizedAccess } from "../middlewares";
import { getStringDate, getStringFullDate } from "../utils";
import User from "../models/User";
import bcrypt from "bcrypt";

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  const checkResult = await checkUserExist(req, res, userId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const user = checkResult.user;

  const isMyProfile = req.session.user._id === userId ? true : false;

  let pageTitle = isMyProfile ? "마이페이지" : `${user.nickname}님의 프로필`;

  const joinDate = getStringDate(user.joinDate);
  const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

  res.render("user/userProfile", {
    pageTitle,
    user,
    isMyProfile,
    joinDate,
    lastLoggedInDate,
  });
};

export const getEditUserProfile = async (req, res) => {
  const loggedInUserId = req.session.user._id;

  const checkResult = await checkUserExist(req, res, loggedInUserId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const user = checkResult.user;

  return res.render("user/editUserProfile", {
    pageTitle: "프로필 수정",
    user,
  });
};

export const postEditUserProfile = async (req, res) => {
  const loggedInUserId = req.session.user._id;
  const { name, nickname, email } = req.body;
  const { file } = req;

  const checkResult = await checkUserExist(req, res, loggedInUserId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const user = checkResult.user;

  if (user.nickname !== nickname) {
    let existedNickname;
    try {
      existedNickname = await User.exists({ nickname });
    } catch (error) {
      console.log(error);
      req.flash("error", "유저 정보를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (existedNickname) {
      req.flash("error", "이미 사용 중인 닉네임입니다.");
      return res.status(400).redirect("/join");
    }
  }

  if (user.email !== email) {
    let existedEmail;
    try {
      existedEmail = await User.exists({ email });
    } catch (error) {
      console.log(error);
      req.flash("error", "유저 정보를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (existedEmail) {
      req.flash("error", "이미 사용 중인 이메일입니다.");
      return res.status(400).redirect("/join");
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name,
        nickname,
        email,
        avatarUrl: file ? file.path : user.avatarUrl,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    req.flash("success", "프로필을 수정했습니다.");
    return res.status(200).redirect(`/user/profile/${user._id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "프로필을 수정하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect(`/user/profile/${user._id}`);
  }
};

export const getEditUserPassword = async (req, res) => {
  const loggedInUserId = req.session.user._id;

  const checkResult = await checkUserExist(req, res, loggedInUserId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  return res.render("user/editUserPassword", { pageTitle: "비밀번호 변경" });
};

export const postEditUserPassword = async (req, res) => {
  const loggedInUserId = req.session.user._id;
  const { password, new_password, new_password_confirm } = req.body;

  const checkResult = await checkUserExist(req, res, loggedInUserId);

  if (checkResult.pass === false) {
    return checkResult.return;
  }

  const user = checkResult.user;

  let passwordCorrect;
  try {
    passwordCorrect = await bcrypt.compare(password, user.password);
  } catch (error) {
    console.log(error);
    req.flash("error", "비밀번호를 검증하는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!passwordCorrect) {
    req.flash("error", "비밀번호가 일치하지 않습니다.");
    return res.status(400).redirect(`/user/edit-password`);
  }

  if (new_password !== new_password_confirm) {
    req.flash(
      "error",
      "입력하신 새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다."
    );
    return res.status(400).redirect(`/user/edit-password`);
  }

  try {
    user.password = new_password;
    await user.save();
    req.session.user = user;
    req.flash("success", "비밀번호를 변경했습니다.");
    return res.status(200).redirect(`/user/profile/${user._id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "비밀번호를 변경하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect(`/user/edit-password`);
  }
};

export const getUserOwnCategories = async (req, res) => {
  const loggedInUserId = req.session.user._id;
  const { categoryType } = req.params;

  let user;
  let userCategories;
  try {
    if (categoryType === "i") {
      user = await User.findById(loggedInUserId).populate("incomeCategories");
      userCategories = user.incomeCategories;
    } else if (categoryType === "e") {
      user = await User.findById(loggedInUserId).populate("expenseCategories");
      userCategories = user.expenseCategories;
    }
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }

  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  let pageTitle;

  if (categoryType === "i") {
    pageTitle = `${user.nickname} 님의 수입 카테고리`;
  } else {
    pageTitle = `${user.nickname} 님의 지출 카테고리`;
  }

  res.render("user/userOwnCategories", {
    pageTitle,
    userCategories,
    categoryType,
  });
};

export const postAddUserCategory = async (req, res) => {
  const loggedInUserId = req.session.user._id;
  const { categoryType } = req.params;
  const { new_category } = req.body;

  let user;
  try {
    if (categoryType === "i") {
      user = await User.findById(loggedInUserId).populate("incomeCategories");
      user.incomeCategories.push(new_category);
    } else if (categoryType === "e") {
      user = await User.findById(loggedInUserId).populate("expenseCategories");
      user.expenseCategories.push(new_category);
    }
    await user.save();
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }

  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  res.redirect(`/user/own-categories/${categoryType}`);
};

export const postDeleteUserCategory = async (req, res) => {
  const loggedInUserId = req.session.user._id;
  const { categoryType } = req.params;
  const { categoryName } = req.body;

  let user;
  try {
    if (categoryType === "i") {
      user = await User.findById(loggedInUserId).populate("incomeCategories");
      user.incomeCategories = user.incomeCategories.filter(
        (el) => el !== categoryName
      );
    } else if (categoryType === "e") {
      user = await User.findById(loggedInUserId).populate("expenseCategories");
      user.expenseCategories = user.expenseCategories.filter(
        (el) => el !== categoryName
      );
    }
    await user.save();
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }

  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  return res.sendStatus(200);
};

export const getUserOwnPosts = async (req, res) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId).populate("postList");
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }

  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  const joinDate = getStringDate(user.joinDate);
  const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

  res.render("user/userOwnPosts", {
    pageTitle: `${user.nickname} 님의 작성 글`,
    user,
    joinDate,
    lastLoggedInDate,
  });
};

export const getUserOwnComments = async (req, res) => {
  const { userId } = req.params;

  let user;
  try {
    user = await User.findById(userId).populate({
      path: "commentList",
      populate: "post",
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }

  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  const joinDate = getStringDate(user.joinDate);
  const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

  res.render("user/userOwnComments", {
    pageTitle: `${user.nickname} 님의 작성 댓글`,
    user,
    joinDate,
    lastLoggedInDate,
  });
};

const checkUserExist = async (req, res, userId) => {
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return { pass: false, return: res.status(404).redirect("/") };
  }

  return { pass: true, user: user };
};
