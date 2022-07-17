import express from "express";
import {
  getHome,
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
} from "../controllers/globalController";
import { userOnlyMiddleware } from "../middlewares";

const globalRouter = express.Router();

globalRouter.route("/").get(getHome);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.route("/logout").all(userOnlyMiddleware).get(logout);

export default globalRouter;
