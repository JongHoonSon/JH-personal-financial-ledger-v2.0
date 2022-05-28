export const getProfile = (req, res) => {
  res.render("user/profile", { pageTitle: "Profile" });
};

export const getEditProfile = (req, res) => {
  res.render("user/editProfile", {
    pageTitle: "Edit Profile",
  });
};

export const postEditProfile = (req, res) => {};
