import express from "express";
import { getChart, getLastExpense } from "../controllers/etcController";
import { userOnlyMiddleware } from "../middlewares";

const etcRouter = express.Router();

etcRouter.get("/chart", userOnlyMiddleware, getChart);
etcRouter.get("/last-expense", userOnlyMiddleware, getLastExpense);

export default etcRouter;
