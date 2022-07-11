import Income from "../models/Income";
import User from "../models/User";

function sortItem(itemList) {
  itemList.sort((a, b) => a.date - b.date);
}

function getStringDate(date) {
  return (
    date.getFullYear().toString() +
    "-" +
    (date.getMonth() + 1).toString().padStart(2, 0) +
    "-" +
    date.getDate().toString().padStart(2, 0)
  );
}

Date.prototype.getWeek = function (dowOffset) {
  dowOffset = typeof dowOffset == "number" ? dowOffset : 0;
  var newYear = new Date(this.getFullYear(), 0, 1);
  var day = newYear.getDay() - dowOffset;
  day = day >= 0 ? day : day + 7;
  var daynum =
    Math.floor(
      (this.getTime() -
        newYear.getTime() -
        (this.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
        86400000
    ) + 1;
  var weeknum;

  if (day < 4) {
    weeknum = Math.floor((daynum + day - 1) / 7) + 1;
    if (weeknum > 52) {
      let nYear = new Date(this.getFullYear() + 1, 0, 1);
      let nday = nYear.getDay() - dowOffset;
      nday = nday >= 0 ? nday : nday + 7;
      weeknum = nday < 4 ? 1 : 53;
    }
  } else {
    weeknum = Math.floor((daynum + day - 1) / 7);
  }
  return weeknum;
};

export const getLedgerDaily = async (req, res) => {
  const { yyyy, mm, dd } = req.params;

  const todayStringDate = yyyy + "-" + mm + "-" + dd;
  const todayDate = new Date(todayStringDate);

  const prevDate = new Date(todayDate.getTime());
  prevDate.setDate(todayDate.getDate() - 1);
  const prev = getStringDate(prevDate);

  const nextDate = new Date(todayDate.getTime());
  nextDate.setDate(todayDate.getDate() + 1);
  const next = getStringDate(nextDate);

  const loggedInUser = res.locals.loggedInUser;
  const user = await User.findById(loggedInUser._id)
    .populate("incomeList")
    .populate("expenseList");
  const { incomeList, expenseList } = user;

  const itemList = new Array();
  incomeList.forEach((el) => {
    if (getStringDate(el.date) === todayStringDate) {
      itemList.push(el);
    }
  });
  expenseList.forEach((el) => {
    if (getStringDate(el.date) === todayStringDate) {
      itemList.push(el);
    }
  });
  sortItem(itemList);

  const cycle = "daily";
  const now = todayStringDate;

  res.render("ledger/ledgerDaily", {
    pageTitle: "일별 내역",
    itemList,
    prev,
    now,
    next,
    cycle,
  });
};

export const getLedgerWeekly = async (req, res) => {
  const { yyyy, mm, dd } = req.params;

  const todayStringDate = yyyy + "-" + mm + "-" + dd;
  const todayDate = new Date(todayStringDate);
  const todayWeek = todayDate.getWeek();

  const prevDate = new Date(todayDate.getTime());
  prevDate.setDate(todayDate.getDate() - 7);
  const prev = getStringDate(prevDate);

  const nextDate = new Date(todayDate.getTime());
  nextDate.setDate(todayDate.getDate() + 7);
  const next = getStringDate(nextDate);

  const loggedInUser = res.locals.loggedInUser;
  const user = await User.findById(loggedInUser._id)
    .populate("incomeList")
    .populate("expenseList");
  const { incomeList, expenseList } = user;

  const itemList = new Array();
  console.log("item push");
  incomeList.forEach((el) => {
    console.log(el.date.getWeek());
    if (el.date.getWeek() === todayWeek) {
      itemList.push(el);
    }
  });
  expenseList.forEach((el) => {
    if (el.date.getWeek() === todayWeek) {
      itemList.push(el);
    }
  });
  sortItem(itemList);

  console.log("itemList");
  console.log(itemList);

  const cycle = "weekly";
  const now = todayStringDate;

  console.log(todayWeek);

  res.render("ledger/ledgerWeekly", {
    pageTitle: "주별 내역",
    itemList,
    prev,
    now,
    next,
    cycle,
  });
};

export const getLedgerMonthly = (req, res) => {
  res.render("ledger/ledgerMonthly", { pageTitle: "월별 내역" });
};

export const getLedgerYearly = (req, res) => {
  res.render("ledger/ledgerYearly", { pageTitle: "연도별 내역" });
};
