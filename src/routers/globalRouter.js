import express from "express";
import {
  finishGoogleLogin,
  getHome,
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
  startGoogleLogin,
} from "../controllers/globalController";
import { loggedInUserOnly, publicOnly } from "../middlewares";
import passport from "../config/passport";

const globalRouter = express.Router();

globalRouter.route("/").get(getHome);
globalRouter.route("/join").all(publicOnly).get(getJoin).post(postJoin);
globalRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);
globalRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
globalRouter.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  authSuccess
);
function authSuccess(req, res) {
  res.redirect("/");
}
globalRouter.get("/logout", loggedInUserOnly, logout);

export default globalRouter;
