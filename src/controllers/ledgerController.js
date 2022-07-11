import Income from "../models/Income";
import User from "../models/User";

export const getLedgerDaily = async (req, res) => {
  const loggedInUser = res.locals.loggedInUser;

  const user = await User.findById(loggedInUser._id)
    .populate("incomeList")
    .populate("expenseList");

  const { incomeList, expenseList } = user;

  const itemList = new Array();
  itemList.push(...incomeList);
  itemList.push(...expenseList);
  itemList.sort((a, b) => a.date - b.date);

  console.log("itemList");
  console.log(itemList);

  res.render("ledger/ledgerDaily", {
    pageTitle: "일별 내역",
    itemList,
  });
};

export const getLedgerWeekly = (req, res) => {
  res.render("ledger/ledgerWeekly", { pageTitle: "주별 내역" });
};

export const getLedgerMonthly = (req, res) => {
  res.render("ledger/ledgerMonthly", { pageTitle: "월별 내역" });
};

export const getLedgerYearly = (req, res) => {
  res.render("ledger/ledgerYearly", { pageTitle: "연도별 내역" });
};
