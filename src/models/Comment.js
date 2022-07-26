import mongoose from "mongoose";
import { getStringDate } from "../utils";

const commentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  stringDate: {
    type: String,
    required: true,
    default: getStringDate(new Date()),
  },
  content: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Post",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
