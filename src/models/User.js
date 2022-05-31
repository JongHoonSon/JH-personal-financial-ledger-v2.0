import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  nickname: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  socialAccount: { type: Boolean, required: true, default: false },
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
});

const User = mongoose.model("User", userSchema);

export default User;
