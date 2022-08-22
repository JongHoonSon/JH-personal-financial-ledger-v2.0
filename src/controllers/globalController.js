import User from "../models/User";
import bcrypt from "bcrypt";

export const getHome = (req, res) => {
  return res.render("global/home", { pageTitle: "홈" });
};

export const getJoin = (req, res) => {
  return res.render("global/join", { pageTitle: "회원가입" });
};

export const postJoin = async (req, res) => {
  const { username, password, password_confirm, name, email, nickname } =
    req.body;

  if (password !== password_confirm) {
    req.flash(
      "error",
      "입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다."
    );
    return res.status(400).redirect("/join");
  }

  let existedUsername;
  try {
    existedUsername = await User.exists({ username });
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 찾는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (existedUsername) {
    req.flash("error", "이미 사용 중인 아이디입니다.");
    return res.status(400).redirect("/join");
  }

  let existedEmail;
  try {
    existedEmail = await User.exists({ email });
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 찾는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (existedEmail) {
    req.flash("error", "이미 사용 중인 이메일입니다.");
    return res.status(400).redirect("/join");
  }

  let existedNickname;
  try {
    existedNickname = await User.exists({ nickname });
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 찾는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (existedNickname) {
    req.flash("error", "이미 사용 중인 닉네임입니다.");
    return res.status(400).redirect("/join");
  }

  try {
    await User.create({
      username,
      password,
      name,
      email,
      nickname,
      avatarUrl: "defaults/default_avatar.png",
    });
    req.flash("success", "회원가입에 완료했습니다.");
    return res.status(200).redirect("/login");
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 생성하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect("/join");
  }
};

export const getLogin = (req, res) => {
  return res.render("global/login", { pageTitle: "로그인" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  let user;
  try {
    user = await User.findOne({ username, socialOnly: false });
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!user) {
    req.flash("error", "입력하신 아이디는 없는 아이디입니다.");
    return res.status(400).redirect("/login");
  }

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
    return res.status(400).redirect("/login");
  }

  req.session.loggedIn = true;
  req.session.user = user;

  req.flash("success", `안녕하세요, ${user.nickname} 님!`);
  return res.status(200).redirect("/");
};

export const logout = (req, res) => {
  const loggedInUserNickname = req.session.user.username;
  req.session.user = null;
  req.session.loggedIn = false;
  res.locals.loggedInUser = req.session.user;

  req.flash("success", `다음에 또 봬요, ${loggedInUserNickname} 님!`);
  return res.status(200).redirect("/");
};

export const finishGoogleLogin = (req, res) => {
  req.session.loggedIn = true;
  req.session.user = req.user;

  return res.redirect("/");
};
