import express from "express";
import { globalController } from "../controllers";
import { loginRequiredPage, anonymousUserPage } from "../middlewares";
import passport from "../lib/passport.js";

const globalRouter = express.Router();

globalRouter.route("/").get(loginRequiredPage, globalController.getHome);
globalRouter
  .route("/join")
  .get(anonymousUserPage, globalController.getJoin)
  .post(globalController.postJoin);
globalRouter
  .route("/login")
  .get(anonymousUserPage, globalController.getLogin)
  .post(globalController.postLogin);
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

globalRouter.get("/logout", loginRequiredPage, globalController.logout);

export default globalRouter;
