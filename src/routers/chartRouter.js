import express from "express";
import { chartController } from "../controllers";
import { loginRequiredPage } from "../middlewares";

const chartRouter = express.Router();

chartRouter.get("/:type/:days", loginRequiredPage, chartController.getChart);

export default chartRouter;
