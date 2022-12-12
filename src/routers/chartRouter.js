import express from "express";
import { chartController } from "../controllers";
import { loginRequired } from "../middlewares";

const chartRouter = express.Router();

chartRouter.get("/:type/:days", loginRequired, chartController.getChart);

export default chartRouter;
