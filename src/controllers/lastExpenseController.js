import { userModel } from "./../db/models";
import { getStringDate, sortItem, getDaysDiff } from "../utils";

class LastExpenseController {
  async getLastExpense(req, res, next) {
    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("expenseCategories")
        .populate("expenseList");
      if (!user) {
        const error = new Error("유저를 DB에서 찾을 수 없습니다.");
        error.statusCode = 404;
        next(error);
        return;
      }
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const expenseList = user.expenseList;
    const lastExpenseList = [];
    const nowStringDate = getStringDate(res.locals.date);

    const categories = user.expenseCategories;

    for (let i = 0; i < categories.length; i++) {
      const expenseListByCategories = [];
      for (let j = 0; j < expenseList.length; j++) {
        if (expenseList[j].category === categories[i]) {
          expenseListByCategories.push(expenseList[j]);
        }
      }

      if (expenseListByCategories.length === 0) {
        lastExpenseList.push({
          category: categories[i],
          content: null,
        });
      } else {
        sortItem(expenseListByCategories);
        const lastestItemStringDate = expenseListByCategories[0].stringDate;
        lastExpenseList.push({
          category: categories[i],
          content: expenseListByCategories[0],
          daysDiff: getDaysDiff(nowStringDate, lastestItemStringDate),
          lastestItemStringDate: lastestItemStringDate,
        });
      }
    }

    return res.render("last-expense/last-expense", {
      pageTitle: "마지막 지출",
      lastExpenseList,
    });
  }
}

const lastExpenseController = new LastExpenseController();

export default lastExpenseController;
