import express from "express";
import { getChart } from "../controllers/chartController";
import { loggedInUserOnly } from "../middlewares";

const chartRouter = express.Router();

chartRouter.get("/:type/:days", loggedInUserOnly, getChart);

export default chartRouter;
