import mongoose from "mongoose";
import {
  createStringDate,
  getStringDate,
  createStringFullDate,
} from "./../../utils";

const incomeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      default: "i",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    date: {
      type: Date,
      required: true,
    },

    stringDate: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },

    createdAtStringDate: {
      type: String,
      required: true,
      default: createStringDate,
    },

    createdAtStringFullDate: {
      type: String,
      required: true,
      default: createStringFullDate,
    },

    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    cycle: {
      type: String,
      required: true,
    },

    pinned: {
      type: Boolean,
      required: true,
      default: false,
    },

    imageUrl: {
      type: String,
    },
  },
  {
    collection: "incomes",
  }
);

incomeSchema.pre("save", function () {
  if (this.isModified("date")) {
    this.stringDate = getStringDate(this.date);
  }
});

export default incomeSchema;
