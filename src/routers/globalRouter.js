import express from "express";

const globalRouter = express.Router();

globalRouter.route("/join").get(getJoin).post(postJoin);

export default globalRouter;
