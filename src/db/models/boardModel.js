import mongoose from "mongoose";
import { boardSchema } from "../schemas";

const Board = mongoose.model("Board", boardSchema);

class BoardModel {
  async create(params) {
    try {
      const board = await Board.create(params);
      return board;
    } catch (error) {
      error.messageToShow =
        "게시판을 DB에 생성하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
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
      error.messageToShow =
        "게시판을 DB에서 찾는 과정에서 오류가 발생했습니다.";
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
      error.messageToShow =
        "게시판을 DB에서 찾는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }

  findWithPopulate(params) {
    return Board.find(params);
  }

  findOneWithPopulate(params) {
    return Board.findOne(params);
  }
}

const boardModel = new BoardModel();

export default boardModel;
