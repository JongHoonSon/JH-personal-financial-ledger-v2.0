import mongoose from "mongoose";
import { expenseSchema } from "../schemas";

export const expenseModel = mongoose.model("Expense", expenseSchema);
