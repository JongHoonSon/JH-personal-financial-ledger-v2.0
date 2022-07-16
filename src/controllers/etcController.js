import User from "../models/User";
import { getStringDate, sortItem, getStringDateDiff } from "../utils";

export const getChart = (req, res) => {
  res.render("etc/chart", { pageTitle: "소비 리포트" });
};

export const getLastExpense = async (req, res) => {
  const loggedInUser = res.locals.loggedInUser;

  const user = await User.findById(loggedInUser._id).populate("expenseList");

  const expenseList = user.expenseList;

  const lastExpenseList = [];

  const categories = [
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
      lastExpenseList.push({
        category: categories[i],
        content: expenseListByCategories[0],
        daysDiff: getStringDateDiff(
          nowStringDate,
          getStringDate(expenseListByCategories[0].date)
        ),
      });
    }
  }

  console.log("------");
  console.log(lastExpenseList);

  res.render("etc/lastExpense", {
    pageTitle: "마지막 지출일",
    lastExpenseList,
  });
};
