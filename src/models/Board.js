import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  postList: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
  ],
});

const Board = mongoose.model("board", boardSchema);

export default Board;
