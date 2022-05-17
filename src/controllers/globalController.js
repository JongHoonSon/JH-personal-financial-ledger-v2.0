export const getHome = (req, res) => {
  res.redirect("/login");
};

export const getJoin = (req, res) => {
  res.send("This is getJoin Page");
};

export const postJoin = (req, res) => {};

export const getLogin = (req, res) => {
  res.send("This is getLogin Page");
};

export const postLogin = (req, res) => {};
