import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  createdAt: { type: Date, required: true, default: Date.now },
  content: { type: String, required: true },
  likes: { type: Number, required: true, defualt: 0 },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Post",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
