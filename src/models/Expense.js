import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  type: { type: String, required: true, default: "e" },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Date, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  cycle: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  pinned: { type: Boolean, required: true, default: false },
  imageUrl: { type: String },
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
