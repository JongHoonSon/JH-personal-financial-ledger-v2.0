import mongoose from "mongoose";
import { expenseSchema } from "../schemas";

const Expense = mongoose.model("Expense", expenseSchema);

class ExpenseModel {
  async create(params) {
    try {
      const expense = await Expense.create(params);
      return expense;
    } catch (error) {
      error.messageToShow =
        "지출 내역을 DB에 생성하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }

  async findById(itemId) {
    try {
      const expense = await Expense.findById(itemId);

      if (!expense) {
        const error = new Error("지출 내역을 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        throw error;
      }

      return expense;
    } catch (error) {
      error.messageToShow =
        "지출 내역을 DB에서 찾는 과정에서 에러가 발생했습니다.";
      throw error;
    }
  }

  findByIdWithPopulate(itemId) {
    return Expense.findById(itemId);
  }

  async findByIdAndDelete(itemId) {
    try {
      await Expense.findByIdAndDelete(itemId);
      return;
    } catch (error) {
      error.message =
        "지출 내역을 DB에서 삭제하는 과정에서 오류가 발생했습니다.";
      throw error;
    }
  }
}

const expenseModel = new ExpenseModel();

export default expenseModel;
