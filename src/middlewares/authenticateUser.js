const authenticateUser = (req, res, next) => {
  console.log("req.session.user");
  console.log(req.session.user);

  console.log("req.session.loggedIn");
  console.log(req.session.loggedIn);

  //   if (!req.session.user) {
  //     res.locals.loggedInUser = {};
  //     res.locals.loggedIn = false;
  //   }

  next();
};

export default authenticateUser;
