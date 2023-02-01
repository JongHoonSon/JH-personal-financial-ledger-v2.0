import mongoose from "mongoose";
import { incomeSchema } from "../schemas";

const incomeModel = mongoose.model("Income", incomeSchema);

export default incomeModel;
