import express from "express";
import { chartController } from "../controllers";
import { loggedInUserOnly } from "../middlewares";

const chartRouter = express.Router();

chartRouter.get("/:type/:days", loggedInUserOnly, chartController.getChart);

export default chartRouter;
