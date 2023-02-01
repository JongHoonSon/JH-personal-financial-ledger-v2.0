import mongoose from "mongoose";
import { boardSchema } from "../schemas";

export const boardModel = mongoose.model("Board", boardSchema);
