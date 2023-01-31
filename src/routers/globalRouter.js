import express from "express";
import { globalController } from "../controllers";
import { loginRequired, anonymousUserPage } from "../middlewares";
import passport from "../lib/passport.js";

const globalRouter = express.Router();

// Logged In User required
globalRouter.get("/", loginRequired, globalController.getHome);
globalRouter.get("/logout", loginRequired, globalController.logout);

// Anonymous User Page
globalRouter.use(anonymousUserPage);
globalRouter
  .route("/join")
  .get(globalController.getJoin)
  .post(globalController.join);
globalRouter
  .route("/login")
  .get(globalController.getLogin)
  .post(globalController.login);
globalRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
globalRouter.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  globalController.finishGoogleLogin
);

export default globalRouter;
