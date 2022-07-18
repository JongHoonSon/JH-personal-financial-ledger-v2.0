import express from "express";
import {
  getHome,
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
} from "../controllers/globalController";
import { loggedInUserOnly, publicOnly } from "../middlewares";

const globalRouter = express.Router();

globalRouter.route("/").get(getHome);
globalRouter.route("/join").all(publicOnly).get(getJoin).post(postJoin);
globalRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);
globalRouter.get("/logout", loggedInUserOnly, logout);

export default globalRouter;
