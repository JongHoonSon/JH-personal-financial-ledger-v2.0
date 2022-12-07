import express from "express";
import { getLastExpense } from "../controllers/lastExpenseController";
import { loggedInUserOnly } from "../middlewares";

const lastExpenseRouter = express.Router();

lastExpenseRouter.get("/", loggedInUserOnly, getLastExpense);

export default lastExpenseRouter;
