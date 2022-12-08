import express from "express";
import { chartController } from "../controllers";
import { checkUserLoggedIn } from "../middlewares";

const chartRouter = express.Router();

chartRouter.get("/:type/:days", checkUserLoggedIn, chartController.getChart);

export default chartRouter;
