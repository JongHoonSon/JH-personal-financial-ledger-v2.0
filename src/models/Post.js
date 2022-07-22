import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  category: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, required: true, default: Date.now },
  content: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },
  commentList: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
