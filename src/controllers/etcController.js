import User from "../models/User";
import { getStringDate, sortItem, getStringDateDiff } from "../utils";

const categories = [
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
  const { days } = req.params;

  const loggedInUser = req.session.user;
  let user;
  try {
    user = await User.findById(loggedInUser._id).populate("expenseList");
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 에러가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  let totalSum = 0;
  const sumAmountByCategory = {};
  categories.forEach((el) => (sumAmountByCategory[el] = 0));

  const nowStringDate = getStringDate(res.locals.date);
  const expenseList = user.expenseList;
  expenseList.forEach((el) => {
    if (getStringDateDiff(nowStringDate, getStringDate(el.date)) <= days) {
      sumAmountByCategory[el.category] += el.amount;
      totalSum += el.amount;
    }
  });

  const percentageByCategory = {};

  for (let category in sumAmountByCategory) {
    percentageByCategory[category] =
      (sumAmountByCategory[category] / totalSum).toFixed(2) * 100;
  }

  return res.render("etc/chart", {
    pageTitle: "소비 리포트",
    categories,
    sumAmountByCategory,
    percentageByCategory,
    days,
  });
};

export const getLastExpense = async (req, res) => {
  const loggedInUser = req.session.user;
  let user;
  try {
    user = await User.findById(loggedInUser._id).populate("expenseList");
  } catch (error) {
    console.log(error);
    req.flash("error", "유저를 불러오는 과정에서 에러가 발생했습니다.");
    return res.status(500).redirect("/");
  }
  if (!user) {
    req.flash("error", "유저를 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  const expenseList = user.expenseList;
  const lastExpenseList = [];
  const nowStringDate = getStringDate(res.locals.date);

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
