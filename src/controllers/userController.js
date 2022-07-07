export const getProfile = (req, res) => {
  res.render("user/profile", { pageTitle: "프로필" });
};

export const getEditProfile = (req, res) => {
  res.render("user/editProfile", {
    pageTitle: "프로필 수정",
  });
};

export const postEditProfile = (req, res) => {};
