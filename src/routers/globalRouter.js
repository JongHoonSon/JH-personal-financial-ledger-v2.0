import express from "express";
import {
  getHome,
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/globalController";

const globalRouter = express.Router();

globalRouter.route("/").get(getHome);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);

export default globalRouter;
