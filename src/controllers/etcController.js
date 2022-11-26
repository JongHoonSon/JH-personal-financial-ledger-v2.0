import User from "../models/User";
import {
  getStringDate,
  sortItem,
  getStringDateDiff,
  getStringAmount,
} from "../utils";

export const getChart = async (req, res) => {
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

  return res.render("etc/chart", {
    pageTitle: "소비 리포트",
    type,
    days,
    chartDataArr,
  });
};

export const getLastExpense = async (req, res) => {
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
        daysDiff: getStringDateDiff(nowStringDate, lastestItemStringDate),
        lastestItemStringDate: lastestItemStringDate,
      });
    }
  }

  return res.render("etc/lastExpense", {
    pageTitle: "마지막 지출일",
    lastExpenseList,
  });
};
