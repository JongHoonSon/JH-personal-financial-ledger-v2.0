import express from "express";
import { getChart, getLastExpense } from "../controllers/etcController";
import { loggedInUserOnly } from "../middlewares";

const etcRouter = express.Router();

etcRouter.get("/chart/:type/:days", loggedInUserOnly, getChart);
etcRouter.get("/last-expense", loggedInUserOnly, getLastExpense);

export default etcRouter;
