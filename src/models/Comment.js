import mongoose from "mongoose";
import { getStringDate, getStringFullDate } from "../utils";

const commentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  createdAtStringDate: {
    type: String,
    required: true,
    default: getStringDate(new Date()),
  },
  createdAtStringFullDate: {
    type: String,
    required: true,
    default: getStringFullDate(new Date()),
  },
  content: { type: String, required: true },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Post",
  },
  likesUserList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
