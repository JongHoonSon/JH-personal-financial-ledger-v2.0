import express from "express";
import { chartController } from "../controllers";

export const chartRouter = express.Router();

chartRouter.get("/:type/:days", chartController.getChart);
