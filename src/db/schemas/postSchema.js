import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";
import { createStringDate, createStringFullDate } from "./../../utils";

autoIncrement.initialize(mongoose.connection);

const postSchema = new mongoose.Schema(
  {
    seq: {
      type: Number,
      required: true,
      default: 0,
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },

    title: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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

    content: {
      type: String,
      required: true,
    },

    views: {
      type: Number,
      required: true,
      default: 0,
    },

    likesUserList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],

    commentList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Comment",
      },
    ],
  },
  { collection: "posts", versionKey: false }
);

postSchema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "seq",
  startAt: 1,
  increment: 1,
});

export default postSchema;
