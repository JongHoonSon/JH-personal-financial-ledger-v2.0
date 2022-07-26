import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";
import { getStringDate, getStringFullDate } from "../utils";

autoIncrement.initialize(mongoose.connection);

const postSchema = new mongoose.Schema(
  {
    seq: { type: Number, required: true, default: 0 },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    title: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    createdAt: { type: Date, required: true, default: Date.now },
    stringDate: {
      type: String,
      required: true,
      default: getStringDate(new Date()),
    },
    stringFullDate: {
      type: String,
      required: true,
      default: getStringFullDate(new Date()),
    },
    content: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    likesUserList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    clipUserList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    commentList: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
    ],
  },
  { collection: "", versionKey: false }
);

postSchema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "seq",
  startAt: 1,
  increment: 1,
});

const Post = mongoose.model("Post", postSchema);

export default Post;
