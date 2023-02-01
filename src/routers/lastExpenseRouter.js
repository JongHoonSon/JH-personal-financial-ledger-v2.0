import express from "express";
import { lastExpenseController } from "../controllers";

export const lastExpenseRouter = express.Router();

lastExpenseRouter.get("/", lastExpenseController.getLastExpense);
