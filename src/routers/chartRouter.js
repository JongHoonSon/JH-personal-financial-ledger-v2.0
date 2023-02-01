import express from "express";
import { chartController } from "../controllers";

const chartRouter = express.Router();

chartRouter.get("/:type/:days", chartController.getChart);

export default chartRouter;
