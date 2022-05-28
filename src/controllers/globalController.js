export const getHome = (req, res) => {
  res.render("global/home", { pageTitle: "Home" });
};

export const getJoin = (req, res) => {
  res.render("global/join", { pageTitle: "Join" });
};

export const postJoin = (req, res) => {};

export const getLogin = (req, res) => {
  res.render("global/login", { pageTitle: "Login" });
};

export const postLogin = (req, res) => {};
