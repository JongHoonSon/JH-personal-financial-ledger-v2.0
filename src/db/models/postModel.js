import mongoose from "mongoose";
import { postSchema } from "../schemas";

export const postModel = mongoose.model("Post", postSchema);
