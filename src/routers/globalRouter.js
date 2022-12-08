import express from "express";
import { globalController } from "../controllers";
import { checkUserLoggedIn, publicOnly } from "../middlewares";
import passport from "../lib/passport.js";

const globalRouter = express.Router();

globalRouter.route("/").get(globalController.getHome);
globalRouter
  .route("/join")
  .all(publicOnly)
  .get(globalController.getJoin)
  .post(globalController.postJoin);
globalRouter
  .route("/login")
  .all(publicOnly)
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

globalRouter.get("/logout", checkUserLoggedIn, globalController.logout);

export default globalRouter;
