import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  socialAccount: { type: Boolean, required: true, default: false },
  joinDate: { type: Date, required: true, default: Date.now },
  avatarUrl: { type: String },
  incomeCategories: [
    {
      type: String,
      required: true,
    },
  ],
  expenseCategories: [
    {
      type: String,
      required: true,
    },
  ],
  incomeList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Income",
    },
  ],
  expenseList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Expense",
    },
  ],
  postList: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
  ],
  commentList: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  likesPostList: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
  ],
  likesCommentList: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
  clipPostList: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
  ],
  lastLoggedInDate: { type: Date, required: true, default: Date.now },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
