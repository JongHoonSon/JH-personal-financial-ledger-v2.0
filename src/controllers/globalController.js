import User from "../models/User";

export const getHome = (req, res) => {
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
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }

  if (checkUsername === true) {
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }

  if (checkEmail === true) {
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }

  if (checkNickname === true) {
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
    return res.status(400).render("global/join", { pageTitle: "Join" });
  }

  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  res.render("global/login", { pageTitle: "Login" });
};

export const postLogin = (req, res) => {};
