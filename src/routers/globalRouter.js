import express from "express";
import {
  finishGoogleLogin,
  getHome,
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
} from "../controllers/globalController";
import { loggedInUserOnly, publicOnly } from "../middlewares";
import passport from "../lib/passport.js";

const globalRouter = express.Router();

globalRouter.route("/").get(getHome);
globalRouter.route("/join").all(publicOnly).get(getJoin).post(postJoin);
globalRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);
globalRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
globalRouter.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  finishGoogleLogin
);

globalRouter.get("/logout", loggedInUserOnly, logout);

export default globalRouter;
