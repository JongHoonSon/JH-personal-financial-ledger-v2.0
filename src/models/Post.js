import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

autoIncrement.initialize(mongoose.connection);

const postSchema = new mongoose.Schema(
  {
    seq: { type: Number, required: true, default: 0 },
    title: { type: String, required: true },
    category: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    createdAt: { type: Date, required: true, default: Date.now },
    content: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: true, default: 0 },
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
