import mongoose from "mongoose";
import { getStringDate, getStringFullDate } from "../utils";

const incomeSchema = new mongoose.Schema({
  type: { type: String, required: true, default: "i" },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Date, required: true },
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
  amount: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  cycle: { type: String, required: true },
  pinned: { type: Boolean, required: true, default: false },
  imageUrl: { type: String },
});

const Income = mongoose.model("Income", incomeSchema);

export default Income;
