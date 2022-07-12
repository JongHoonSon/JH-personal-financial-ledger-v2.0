import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  type: { type: String, required: true, default: "i" },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Date, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  amount: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  cycle: { type: String, required: true },
});

const Income = mongoose.model("Income", incomeSchema);

export default Income;
