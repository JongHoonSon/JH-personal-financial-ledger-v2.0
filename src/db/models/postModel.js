import mongoose from "mongoose";
import { postSchema } from "../schemas";

const postModel = mongoose.model("Post", postSchema);

export default postModel;
