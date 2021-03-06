import User from "../models/User";
import bcrypt from "bcrypt";

export const getHome = (req, res) => {
  console.log(req.session);
  res.render("global/home", { pageTitle: "홈" });
};

export const getJoin = (req, res) => {
  res.render("global/join", { pageTitle: "회원가입" });
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
    req.flash("error", "회원가입을 하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect("/join");
  }
};

export const getLogin = (req, res) => {
  res.render("global/login", { pageTitle: "로그인" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    req.flash("error", "입력하신 아이디는 없는 아이디입니다.");
    return res.status(400).redirect("/login");
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);
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
