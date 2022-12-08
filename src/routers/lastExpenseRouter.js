import express from "express";
import { lastExpenseController } from "../controllers";
import { checkUserLoggedIn } from "../middlewares";

const lastExpenseRouter = express.Router();

lastExpenseRouter.get(
  "/",
  checkUserLoggedIn,
  lastExpenseController.getLastExpense
);

export default lastExpenseRouter;
