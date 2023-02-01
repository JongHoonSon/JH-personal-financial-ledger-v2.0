import mongoose from "mongoose";
import { boardSchema } from "../schemas";

const boardModel = mongoose.model("Board", boardSchema);

export default boardModel;
