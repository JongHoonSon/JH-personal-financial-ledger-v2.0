import Income from "../models/Income";
import Expense from "../models/Expense";
import User from "../models/User";

export const getAddExpense = (req, res) => {
  res.render("item/addExpense", { pageTitle: "Add Expense" });
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
    req.flash("success", "Expense added.");
    return res.redirect("/item/add-expense");
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred while creating a expense.");
    return res
      .status(400)
      .render("item/addExpense", { pageTitle: "Add Expense" });
  }
};

export const getAddIncome = (req, res) => {
  res.render("item/addIncome", { pageTitle: "Add Income" });
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
    req.flash("success", "Income added.");
    return res.redirect("/item/add-income");
  } catch (error) {
    console.log(error);
    req.flash("error", "An error occurred while creating a income.");
    return res
      .status(400)
      .render("item/addIncome", { pageTitle: "Add Income" });
  }
};

export const getEditItem = (req, res) => {
  res.render("item/editItem", { pageTitle: "Edit Item" });
};

export const postEditItem = (req, res) => {};

export const postDeleteItem = (req, res) => {};

export const postDeleteItems = (req, res) => {};

export const getDetailItem = (req, res) => {
  res.render("item/detailItem", { pageTitle: "Detail Item" });
};

export const getPinnedItems = (req, res) => {
  res.render("item/pinnedItems", { pageTitle: "Pinned Items" });
};

export const postAddPin = (req, res) => {};

export const postRemovePin = (req, res) => {};
