import { userModel } from "./../db/models";
import { getStringDate, getDaysDiff, getStringAmount } from "../utils";

class ChartController {
  async getChart(req, res, next) {
    const { type, days } = req.params;

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories")
        .populate("incomeList")
        .populate("expenseList");
    } catch (error) {
      error.statusCode = 404;
      next(error);
    }

    let categories;
    if (type === "income") {
      categories = user.incomeCategories;
    } else if (type === "expense") {
      categories = user.expenseCategories;
    }

    const totalAmountPerCategory = {};
    for (const category of categories) {
      totalAmountPerCategory[category] = 0;
    }

    let itemList;
    if (type === "income") {
      itemList = user.incomeList;
    } else if (type === "expense") {
      itemList = user.expenseList;
    }

    const nowStringDate = getStringDate(res.locals.date);
    let totalAmount = 0;
    if (itemList.length > 0) {
      itemList.forEach((item) => {
        if (getDaysDiff(nowStringDate, item.stringDate) <= days) {
          totalAmountPerCategory[item.category] += item.amount;
          totalAmount += item.amount;
        }
      });
    }

    const percentagePerCategory = {};
    for (const category of categories) {
      if (totalAmount === 0) {
        percentagePerCategory[category] = 0;
      } else {
        percentagePerCategory[category] = (
          (totalAmountPerCategory[category] / totalAmount) *
          100
        ).toFixed(2);
      }
    }

    const chartDataArr = [];
    for (const category of categories) {
      const chartData = {
        category,
        amount: totalAmountPerCategory[category],
        stringAmount: getStringAmount(totalAmountPerCategory[category]),
        percentage: percentagePerCategory[category],
      };

      chartDataArr.push(chartData);
    }

    return res.render("chart/chart", {
      pageTitle: "소비 리포트",
      type,
      days,
      chartDataArr,
    });
  }
}

const chartController = new ChartController();

export default chartController;
