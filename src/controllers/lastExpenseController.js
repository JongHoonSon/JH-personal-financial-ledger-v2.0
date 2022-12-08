import User from "../models/User";
import { getStringDate, sortItem, getDaysDiff } from "../utils";

class LastExpenseController {
  async getLastExpense(req, res) {
    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id)
        .populate("expenseCategories")
        .populate("expenseList");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
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
        const lastestItemStringDate =
          expenseListByCategories[0].createdAtStringDate;
        lastExpenseList.push({
          category: categories[i],
          content: expenseListByCategories[0],
          daysDiff: getDaysDiff(nowStringDate, lastestItemStringDate),
          lastestItemStringDate: lastestItemStringDate,
        });
      }
    }

    return res.render("last-expense/last-expense", {
      pageTitle: "마지막 지출일",
      lastExpenseList,
    });
  }
}

const lastExpenseController = new LastExpenseController();

export default lastExpenseController;
