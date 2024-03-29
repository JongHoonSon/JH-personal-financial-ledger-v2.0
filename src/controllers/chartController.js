import { userModel } from "./../db/models";
import { getStringDate, getDaysDiff, getStringAmount } from "../utils";
import { checkParamNaN, checkParamValue } from "../middlewares";

class ChartController {
  async getChart(req, res, next) {
    const { type, days } = req.params;

    const { isParamCorrectValue } = checkParamValue(
      type,
      ["income", "expense"],
      next
    );
    if (!isParamCorrectValue) return;

    const { isParamNaN } = checkParamNaN(days, next);
    if (isParamNaN) return;

    const { loggedInUser } = req.session;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories")
        .populate("incomeList")
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
      pageTitle: "통계",
      type,
      days,
      chartDataArr,
    });
  }
}

const chartController = new ChartController();

export default chartController;
