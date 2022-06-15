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

export const postLogin = (req, res) => {};
