import mongoose from "mongoose";
import { commentSchema } from "../schemas";

export const commentModel = mongoose.model("Comment", commentSchema);
