import mongoose from "mongoose";
import { incomeSchema } from "../schemas";

export const incomeModel = mongoose.model("Income", incomeSchema);
