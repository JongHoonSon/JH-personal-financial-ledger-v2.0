import User from "../models/User";
import { getStringDate, getStringDateDiff, getStringAmount } from "../utils";

class ChartController {
  async getChart(req, res) {
    const { type, days } = req.params;

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await User.findById(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories")
        .populate("incomeList")
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

    let totalSum = 0;
    const sumAmountByCategory = {};
    let categories;
    if (type === "income") {
      categories = user.incomeCategories;
    } else if (type === "expense") {
      categories = user.expenseCategories;
    }
    for (let category of categories) {
      sumAmountByCategory[category] = 0;
    }

    const nowStringDate = getStringDate(res.locals.date);

    let itemList;
    if (type === "income") {
      itemList = user.incomeList;
    } else if (type === "expense") {
      itemList = user.expenseList;
    }

    if (itemList.length > 0) {
      itemList.forEach((el) => {
        if (getStringDateDiff(nowStringDate, el.stringDate) <= days) {
          sumAmountByCategory[el.category] += el.amount;
          totalSum += el.amount;
        }
      });
    }

    const percentageByCategory = {};

    for (let category of categories) {
      if (totalSum === 0) {
        percentageByCategory[category] = 0;
      } else {
        percentageByCategory[category] = (
          (sumAmountByCategory[category] / totalSum) *
          100
        ).toFixed(2);
      }
    }

    const chartDataArr = [];

    for (let category of categories) {
      const chartData = {
        category: category,
        sumAmount: sumAmountByCategory[category],
        string_sumAmount: getStringAmount(sumAmountByCategory[category]),
        percentage: percentageByCategory[category],
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
