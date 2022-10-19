import mongoose from "mongoose";
import { getStringDate, getStringFullDate } from "../utils";

const incomeSchema = new mongoose.Schema({
  type: { type: String, required: true, default: "i" },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  date: { type: Date, required: true },
  stringDate: { type: String, default: "" },
  createdAt: { type: Date, required: true, default: Date.now },
  createdAtStringDate: {
    type: String,
    required: true,
    default: getStringDate(new Date()),
  },
  createdAtStringFullDate: {
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

incomeSchema.pre("save", function () {
  if (this.isModified("date")) {
    this.stringDate = getStringDate(this.date);
  }
});

const Income = mongoose.model("Income", incomeSchema);

export default Income;
