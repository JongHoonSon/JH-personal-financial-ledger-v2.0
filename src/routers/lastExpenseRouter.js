import express from "express";
import { lastExpenseController } from "../controllers";
import { loggedInUserOnly } from "../middlewares";

const lastExpenseRouter = express.Router();

lastExpenseRouter.get(
  "/",
  loggedInUserOnly,
  lastExpenseController.getLastExpense
);

export default lastExpenseRouter;
