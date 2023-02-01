import mongoose from "mongoose";
import { expenseSchema } from "../schemas";

const expenseModel = mongoose.model("Expense", expenseSchema);

export default expenseModel;
