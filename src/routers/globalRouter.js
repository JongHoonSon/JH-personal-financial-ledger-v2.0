import express from "express";
import { globalController } from "../controllers";
import { checkUserLoggedIn, checkUserAnonymous } from "../middlewares";
import passport from "../lib/passport.js";

const globalRouter = express.Router();

// Logged In User required
globalRouter.get("/", checkUserLoggedIn, globalController.getHome);
globalRouter.get("/logout", checkUserLoggedIn, globalController.logout);

// Anonymous User Page
globalRouter
  .route("/join")
  .get(checkUserAnonymous, globalController.getJoin)
  .post(globalController.join);

globalRouter
  .route("/login")
  .get(checkUserAnonymous, globalController.getLogin)
  .post(globalController.login);

globalRouter.get(
  "/auth/google",
  checkUserAnonymous,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

globalRouter.get(
  "/auth/google/callback",
  checkUserAnonymous,
  passport.authenticate("google"),
  globalController.finishGoogleLogin
);

export default globalRouter;
