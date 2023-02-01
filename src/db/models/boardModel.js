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
        const error = new Error("게시판을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return board;
    } catch (error) {
      throw error;
    }
  }

  async findOne(params) {
    try {
      const board = await Board.findOne(params);

      if (!board) {
        const error = new Error("게시판을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return board;
    } catch (error) {
      throw error;
    }
  }
}

const boardModel = new BoardModel();

export default boardModel;
