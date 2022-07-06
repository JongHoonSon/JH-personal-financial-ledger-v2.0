import User from "../models/User";
import bcrypt from "bcrypt";

export const getHome = (req, res) => {
  console.log(req.session);
  res.render("global/home", { pageTitle: "Home" });
};

export const getJoin = (req, res) => {
  res.render("global/join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { username, password, password_confirm, name, email, nickname } =
    req.body;
  const checkUsername = await User.exists({ username });
  const checkEmail = await User.exists({ email });
  const checkNickname = await User.exists({ nickname });

  console.log(req.body);

  if (password !== password_confirm) {
    req.flash("error", "Password confirm failed.");
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }
  if (checkUsername === true) {
    req.flash("error", "This username is already taken");
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }

  if (checkEmail === true) {
    req.flash("error", "This email is already taken");
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }

  if (checkNickname === true) {
    req.flash("error", "This nickname is already taken");
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }

  try {
    await User.create({
      username,
      password,
      name,
      email,
      nickname,
    });
  } catch (error) {
    req.flash("error", "An error occurred while creating a user.");
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }

  req.flash("success", "User created.");
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  res.render("global/login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, socialOnly: false });

  if (!user) {
    req.flash("error", "User does not exists.");
    return res.status(400).render("global/login", { pageTitle: "Login" });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    req.flash("error", "Incorrect password.");
    return res.status(400).render("global/login", { pageTitle: "Login" });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  req.flash("success", `Hello, ${user.nickname} !`);
  return res.redirect("/");
};

export const logout = (req, res) => {
  const loggedInUserNickname = req.session.user.username;
  req.session.user = null;
  req.session.loggedIn = false;
  res.locals.loggedInUser = req.session.user;
  req.flash("success", `See you again, ${loggedInUserNickname}!`);
  return res.redirect("/");
};
