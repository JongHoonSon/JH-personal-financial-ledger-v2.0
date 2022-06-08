import express from "express";
import { getChart, getLastExpense } from "../controllers/etcController";

const etcRouter = express.Router();

etcRouter.get("/chart", getChart);
etcRouter.get("/last-expense", getLastExpense);

export default etcRouter;
