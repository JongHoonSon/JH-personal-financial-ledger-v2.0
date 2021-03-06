import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  socialAccount: { type: Boolean, required: true, default: false },
  avatarUrl: { type: String },
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
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
