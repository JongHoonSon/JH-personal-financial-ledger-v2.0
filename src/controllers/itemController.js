import Income from "../models/Income";
import Expense from "../models/Expense";
import User from "../models/User";
import { getStringDate, sortItem } from "../utils";

export const getAddExpense = (req, res) => {
  res.render("item/addExpense", { pageTitle: "지출 내역 추가" });
};

export const postAddExpense = async (req, res) => {
  const { date, amount, category, description, cycle, paymentMethod } =
    req.body;

  const loggedInUser = req.session.user;

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
    return res.status(200).redirect("/item/add-expense");
  } catch (error) {
    console.log(error);
    req.flash("error", "지출 내역을 추가하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect("item/add-expense");
  }
};

export const getAddIncome = (req, res) => {
  res.render("item/addIncome", { pageTitle: "수입 내역 추가" });
};

export const postAddIncome = async (req, res) => {
  const { date, amount, category, description, cycle } = req.body;

  const loggedInUser = req.session.user;

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
    return res.status(200).redirect("/item/add-income");
  } catch (error) {
    console.log(error);
    req.flash("error", "수입 내역을 추가하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect("/item/add-income");
  }
};

export const getEditItem = async (req, res) => {
  const { type, itemId } = req.params;

  let item;

  if (type === "i") {
    item = await Income.findById(itemId);
  } else {
    item = await Expense.findById(itemId);
  }

  const itemStringDate = getStringDate(item.date);

  res.render("item/editItem", { pageTitle: "내역 수정", item, itemStringDate });
};

export const postEditItem = async (req, res) => {
  const { type, itemId } = req.params;
  const { date, amount, category, description, cycle } = req.body;
  let paymentMethod;
  let item;

  if (type === "i") {
    paymentMethod = req.body.paymentMethod;
    item = await Income.findById(itemId).populate("owner");
  } else {
    item = await Expense.findById(itemId).populate("owner");
  }

  if (!item) {
    req.flash("error", "아이템을 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  const loggedInUser = req.session.user;
  const user = await User.findById(loggedInUser._id);

  if (String(item.owner._id) !== String(user._id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  try {
    if (item.type === "i") {
      await Income.findByIdAndUpdate(itemId, {
        date,
        amount,
        category,
        description,
        cycle,
      });
    } else {
      await Expense.findByIdAndUpdate(itemId, {
        date,
        amount,
        category,
        description,
        cycle,
        paymentMethod,
      });
    }
    req.flash("success", "아이템을 수정했습니다.");
    return res.status(200).redirect(`/item/detail/${item.type}/${item.id}`);
  } catch (error) {
    console.log(error);
    req.flash("error", "아이템을 수정하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect(`/item/edit/${item.type}/${item.id}`);
  }
};

export const postDeleteItem = async (req, res) => {
  const { type, itemId } = req.params;

  let item;

  if (type === "i") {
    item = await Income.findById(itemId).populate();
  } else {
    item = await Expense.findById(itemId).populate();
  }

  if (!item) {
    req.flash("error", "아이템을 찾을 수 없습니다.");
    return res.status(404).redirect("/");
  }

  const loggedInUser = req.session.user;
  const user = await User.findById(loggedInUser._id);

  if (String(item.owner._id) !== String(user._id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  try {
    if (item.type === "i") {
      await Income.findByIdAndDelete(itemId);
      user.incomeList = user.incomeList.filter(
        (income) => String(income._id) !== String(itemId)
      );
      user.save();
    } else {
      await Expense.findByIdAndDelete(itemId);
      user.expenseList = user.expenseList.filter(
        (expense) => String(expense._id) !== String(itemId)
      );
      user.save();
    }
    req.flash("success", "아이템을 삭제했습니다.");
    return res.status(200).redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("error", "아이템을 삭제하는 과정에서 오류가 발생했습니다.");
    return res.status(400).redirect(`/item/detail/${item.type}/${item.id}`);
  }
};

export const postDeleteItems = (req, res) => {};

export const getDetailItem = async (req, res) => {
  const { type, itemId } = req.params;

  let item;

  if (type === "i") {
    item = await Income.findById(itemId);
  } else {
    item = await Expense.findById(itemId);
  }

  const itemStringDate = getStringDate(item.date);

  res.render("item/detailItem", {
    pageTitle: "상세 내역",
    item,
    itemStringDate,
  });
};

export const getPinnedItems = async (req, res) => {
  const loggedInUser = req.session.user;

  const user = await User.findById(loggedInUser._id)
    .populate("incomeList")
    .populate("expenseList");

  const itemList = new Array();

  const { incomeList, expenseList } = user;

  incomeList.forEach((el) => {
    console.log(el);
    if (el.pinned === true) {
      itemList.push(el);
    }
  });

  expenseList.forEach((el) => {
    console.log(el);
    if (el.pinned === true) {
      itemList.push(el);
    }
  });

  sortItem(itemList);

  res.render("item/pinnedItems", { pageTitle: "핀 목록", itemList });
};

export const postAddPin = async (req, res) => {
  const { type, itemId } = req.params;

  const loggedInUser = req.session.user;

  const user = await User.findById(loggedInUser._id);

  let item;

  try {
    if (type === "i") {
      item = await Income.findById(itemId);
    } else {
      item = await Expense.findById(itemId);
    }

    if (item.pinned === false) {
      item.pinned = true;
      await item.save();

      req.flash("success", "핀 목록에 추가하였습니다.");
      return res.status(200).redirect(`/item/detail/${item.type}/${item.id}`);
    } else {
      item.pinned = false;
      await item.save();

      req.flash("success", "핀 목록에서 삭제하였습니다.");
      return res.status(200).redirect(`/item/detail/${item.type}/${item.id}`);
    }
  } catch (error) {
    console.log(error);
    req.flash(
      "error",
      "아이템을 핀 목록에 추가하는 과정에서 오류가 발생했습니다."
    );
    return res.status(400).redirect(`/item/detail/${item.type}/${item.id}`);
  }
};

export const postRemovePin = (req, res) => {};
