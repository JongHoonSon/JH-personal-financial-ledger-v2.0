import mongoose from "mongoose";
import { boardSchema } from "../schemas";

const Board = mongoose.model("Board", boardSchema);

class BoardModel {
  findWithPopulate(params) {
    return Board.find(params);
  }

  findOneWithPopulate(params) {
    return Board.findOne(params);
  }

  async find(params) {
    try {
      const board = await Board.find(params);

      if (!board) {
        const error = new Error("게시판이 존재하지 않습니다.");
        error.statusCode = 404;
        throw error;
      }

      return board;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }
}

const boardModel = new BoardModel();

export default boardModel;
