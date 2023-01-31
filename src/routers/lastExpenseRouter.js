import express from "express";
import { lastExpenseController } from "../controllers";

const lastExpenseRouter = express.Router();

lastExpenseRouter.get("/", lastExpenseController.getLastExpense);

export default lastExpenseRouter;
