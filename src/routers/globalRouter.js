import express from "express";
import { globalController } from "../controllers";
import { loginRequired, anonymousUserPage } from "../middlewares";
import passport from "../lib/passport.js";

const globalRouter = express.Router();

globalRouter.route("/").get(loginRequired, globalController.getHome);
globalRouter
  .route("/join")
  .get(anonymousUserPage, globalController.getJoin)
  .post(globalController.join);
globalRouter
  .route("/login")
  .get(anonymousUserPage, globalController.getLogin)
  .post(globalController.login);
globalRouter.get(
  "/auth/google",
  anonymousUserPage,
  passport.authenticate("google", { scope: ["profile", "email"] })
);
globalRouter.get(
  "/auth/google/callback",
  anonymousUserPage,
  passport.authenticate("google"),
  globalController.finishGoogleLogin
);
globalRouter.get("/logout", loginRequired, globalController.logout);

export default globalRouter;
