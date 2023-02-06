import mongoose from "mongoose";
import { incomeSchema } from "../schemas";

const Income = mongoose.model("Income", incomeSchema);

class IncomeModel {
  async create(params) {
    try {
      const income = await Income.create(params);
      return income;
    } catch (error) {
      error.messageToShow =
        "수입 내역을 DB에 생성하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }

  async findById(itemId) {
    try {
      const income = await Income.findById(itemId);

      if (!income) {
        const error = new Error("수입 내역을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return income;
    } catch (error) {
      error.messageToShow =
        "수입 내역을 DB에서 찾는 과정에서 에러가 발생했습니다.";
      throw error;
    }
  }

  findByIdWithPopulate(itemId) {
    return Income.findById(itemId);
  }

  async findByIdAndDelete(itemId) {
    try {
      await Income.findByIdAndDelete(itemId);
      return;
    } catch (error) {
      error.message =
        "수입 내역을 DB에서 삭제하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }
}

const incomeModel = new IncomeModel();

export default incomeModel;
