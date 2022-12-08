import express from "express";
import { lastExpenseController } from "../controllers";
import { loginRequiredPage } from "../middlewares";

const lastExpenseRouter = express.Router();

lastExpenseRouter.get(
  "/",
  loginRequiredPage,
  lastExpenseController.getLastExpense
);

export default lastExpenseRouter;
