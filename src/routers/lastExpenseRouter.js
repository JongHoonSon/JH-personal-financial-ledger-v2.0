import express from "express";
import { lastExpenseController } from "../controllers";
import { loginRequired } from "../middlewares";

const lastExpenseRouter = express.Router();

lastExpenseRouter.get("/", loginRequired, lastExpenseController.getLastExpense);

export default lastExpenseRouter;
