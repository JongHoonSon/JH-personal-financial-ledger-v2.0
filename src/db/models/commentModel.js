import mongoose from "mongoose";
import { commentSchema } from "../schemas";

const commentModel = mongoose.model("Comment", commentSchema);

export default commentModel;
