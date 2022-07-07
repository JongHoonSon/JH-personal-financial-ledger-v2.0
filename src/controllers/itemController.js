import Income from "../models/Income";
import Expense from "../models/Expense";
import User from "../models/User";

export const getAddExpense = (req, res) => {
  res.render("item/addExpense", { pageTitle: "지출 내역 추가" });
};

export const postAddExpense = async (req, res) => {
  const { date, amount, category, description, cycle, paymentMethod } =
    req.body;

  const loggedInUser = res.locals.loggedInUser;

  try {
    const user = await User.findById(loggedInUser._id);
    const newExpense = await Expense.create({
      owner: user,
      date,
      amount,
      category,
      description,
      cycle,
      paymentMethod,
    });
    user.expenseList.push(newExpense);
    user.save();
    req.flash("success", "지출 내역이 추가되었습니다.");
    return res.redirect("/item/add-expense");
  } catch (error) {
    console.log(error);
    req.flash("error", "지출 내역을 추가하는 과정에서 오류가 발생했습니다.");
    return res
      .status(400)
      .render("item/addExpense", { pageTitle: "지출 내역 추가" });
  }
};

export const getAddIncome = (req, res) => {
  res.render("item/addIncome", { pageTitle: "수입 내역 추가" });
};

export const postAddIncome = async (req, res) => {
  const { date, amount, category, description, cycle } = req.body;

  const loggedInUser = res.locals.loggedInUser;

  try {
    const user = await User.findById(loggedInUser._id);
    const newIncome = await Income.create({
      owner: user,
      date,
      amount,
      category,
      description,
      cycle,
    });
    user.incomeList.push(newIncome);
    user.save();
    req.flash("success", "수입 내역이 추가되었습니다.");
    return res.redirect("/item/add-income");
  } catch (error) {
    console.log(error);
    req.flash("error", "수입 내역을 추가하는 과정에서 오류가 발생했습니다.");
    return res
      .status(400)
      .render("item/addIncome", { pageTitle: "수입 내역 추가" });
  }
};

export const getEditItem = (req, res) => {
  res.render("item/editItem", { pageTitle: "내역 수정" });
};

export const postEditItem = (req, res) => {};

export const postDeleteItem = (req, res) => {};

export const postDeleteItems = (req, res) => {};

export const getDetailItem = (req, res) => {
  res.render("item/detailItem", { pageTitle: "상세 내역" });
};

export const getPinnedItems = (req, res) => {
  res.render("item/pinnedItems", { pageTitle: "핀 목록" });
};

export const postAddPin = (req, res) => {};

export const postRemovePin = (req, res) => {};
