import User from "../models/User";
import { getStringDate, sortItem, getStringDateDiff } from "../utils";

const income_categories = [
  "월급",
  "주급",
  "용돈",
  "은행이자",
  "주식이윤",
  "기타",
];

const expense_categories = [
  "식비",
  "주거비",
  "통신비",
  "교통비",
  "의료비",
  "생활비",
  "의류비",
  "교육비",
  "주식거래",
  "주식손해",
  "기타",
];

export const getChart = async (req, res) => {
  const { type, days } = req.params;

  const loggedInUser = req.session.user;
  let user;
  try {
    user = await User.findById(loggedInUser._id)
      .populate("expenseList")
      .populate("incomeList");
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
    categories = income_categories;
  } else if (type === "expense") {
    categories = expense_categories;
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
      if (getStringDateDiff(nowStringDate, getStringDate(el.date)) <= days) {
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
    user = await User.findById(loggedInUser._id).populate("expenseList");
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

  const categories = expense_categories;

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
      const lastestItemStringDate = getStringDate(
        expenseListByCategories[0].date
      );
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
