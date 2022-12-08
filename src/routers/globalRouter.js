import express from "express";
import { globalController } from "../controllers";
import { loginRequiredPage, anonymousUserPage } from "../middlewares";
import passport from "../lib/passport.js";

const globalRouter = express.Router();

globalRouter.route("/").get(globalController.getHome);
globalRouter
  .route("/join")
  .all(anonymousUserPage)
  .get(globalController.getJoin)
  .post(globalController.postJoin);
globalRouter
  .route("/login")
  .all(anonymousUserPage)
  .get(globalController.getLogin)
  .post(globalController.postLogin);
globalRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
globalRouter.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  globalController.finishGoogleLogin
);

globalRouter.get("/logout", loginRequiredPage, globalController.logout);

export default globalRouter;
