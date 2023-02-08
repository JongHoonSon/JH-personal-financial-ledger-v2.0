import { userModel } from "./../db/models";
import { sortItem, getStringDate, getStringAmount } from "../utils";
import { checkParamValue } from "../middlewares";

class LedgerController {
  async getLedgerDaily(req, res, next) {
    const { yyyy, mm, dd, itemType } = req.params;

    const { isParamCorrectValue } = checkParamValue(
      itemType,
      ["i", "e", "all"],
      next
    );
    if (!isParamCorrectValue) return;

    const todayStringDate = yyyy + "-" + mm + "-" + dd;
    const todayDate = new Date(todayStringDate);

    const prevDate = new Date(todayDate.getTime());
    prevDate.setDate(todayDate.getDate() - 1);
    const prevCalendar = getStringDate(prevDate);

    const nextDate = new Date(todayDate.getTime());
    nextDate.setDate(todayDate.getDate() + 1);
    const nextCalendar = getStringDate(nextDate);

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeList")
        .populate("expenseList");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { incomeList, expenseList } = user;

    let sumIncomeAmount = 0;
    let sumExpenseAmount = 0;

    const itemList = new Array();
    if (itemType === "all" || itemType === "i") {
      incomeList.forEach((el) => {
        if (el.stringDate === todayStringDate) {
          itemList.push(el);
          sumIncomeAmount += el.amount;
        }
      });
    }
    if (itemType === "all" || itemType === "e") {
      expenseList.forEach((el) => {
        if (el.stringDate === todayStringDate) {
          itemList.push(el);
          sumExpenseAmount += el.amount;
        }
      });
    }
    sortItem(itemList);

    let gap = sumIncomeAmount - sumExpenseAmount;
    let stringAbsGap = getStringAmount(Math.abs(gap));
    let stringSumIncomeAmount = getStringAmount(sumIncomeAmount);
    let stringSumExpenseAmount = getStringAmount(sumExpenseAmount);

    const cycle = "daily";
    const now = todayStringDate;
    const calendarTitle = todayStringDate;

    return res.render("ledger/ledger", {
      pageTitle: "일별 내역",
      itemList,
      prevCalendar,
      now,
      nextCalendar,
      calendarTitle,
      cycle,
      gap,
      stringAbsGap,
      stringSumIncomeAmount,
      stringSumExpenseAmount,
      itemType,
    });
  }

  async getLedgerWeekly(req, res, next) {
    const { yyyy, mm, dd, itemType } = req.params;

    const { isParamCorrectValue } = checkParamValue(
      itemType,
      ["i", "e", "all"],
      next
    );
    if (!isParamCorrectValue) return;

    const todayStringDate = yyyy + "-" + mm + "-" + dd;
    const todayDate = new Date(todayStringDate);
    const todayWeek = todayDate.getWeek();

    const prevDate = new Date(todayDate.getTime());
    prevDate.setDate(todayDate.getDate() - 7);
    const prevCalendar = getStringDate(prevDate);

    const nextDate = new Date(todayDate.getTime());
    nextDate.setDate(todayDate.getDate() + 7);
    const nextCalendar = getStringDate(nextDate);

    const todayDay = todayDate.getDay();

    const weekStartDate = new Date(todayDate.getTime());
    weekStartDate.setDate(todayDate.getDate() - todayDay);
    const weekStart = getStringDate(weekStartDate);

    const weekEndDate = new Date(todayDate.getTime());
    weekEndDate.setDate(todayDate.getDate() - todayDay + 6);
    const weekEnd = getStringDate(weekEndDate);

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeList")
        .populate("expenseList");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { incomeList, expenseList } = user;

    let sumIncomeAmount = 0;
    let sumExpenseAmount = 0;

    const itemList = new Array();
    if (itemType === "all" || itemType === "i") {
      incomeList.forEach((el) => {
        if (el.stringDate >= weekStart && el.stringDate <= weekEnd) {
          itemList.push(el);
          sumIncomeAmount += el.amount;
        }
      });
    }
    if (itemType === "all" || itemType === "e") {
      expenseList.forEach((el) => {
        if (el.stringDate >= weekStart && el.stringDate <= weekEnd) {
          itemList.push(el);
          sumExpenseAmount += el.amount;
        }
      });
    }
    sortItem(itemList);

    let gap = sumIncomeAmount - sumExpenseAmount;
    let stringAbsGap = getStringAmount(Math.abs(gap));
    let stringSumIncomeAmount = getStringAmount(sumIncomeAmount);
    let stringSumExpenseAmount = getStringAmount(sumExpenseAmount);

    const cycle = "weekly";
    const now = todayStringDate;

    const calendarTitle = weekStart + " ~ " + weekEnd;

    return res.render("ledger/ledger", {
      pageTitle: "주별 내역",
      itemList,
      prevCalendar,
      now,
      nextCalendar,
      calendarTitle,
      cycle,
      gap,
      stringAbsGap,
      stringSumIncomeAmount,
      stringSumExpenseAmount,
      itemType,
    });
  }

  async getLedgerMonthly(req, res, next) {
    const { yyyy, mm, itemType } = req.params;

    const { isParamCorrectValue } = checkParamValue(
      itemType,
      ["i", "e", "all"],
      next
    );
    if (!isParamCorrectValue) return;

    const prevMonth =
      mm === "01" ? "12" : (Number(mm) - 1).toString().padStart(2, 0);
    const prevYear = prevMonth === "12" ? (Number(yyyy) - 1).toString() : yyyy;
    const prevCalendar = prevYear + "-" + prevMonth;

    const nextMonth =
      mm === "12" ? "01" : (Number(mm) + 1).toString().padStart(2, 0);
    const nextYear = nextMonth === "01" ? (Number(yyyy) + 1).toString() : yyyy;
    const nextCalendar = nextYear + "-" + nextMonth;

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeList")
        .populate("expenseList");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { incomeList, expenseList } = user;

    let sumIncomeAmount = 0;
    let sumExpenseAmount = 0;

    const itemList = new Array();
    if (itemType === "all" || itemType === "i") {
      incomeList.forEach((el) => {
        if (
          el.date.getFullYear().toString() === yyyy &&
          (el.date.getMonth() + 1).toString().padStart(2, 0) === mm
        ) {
          itemList.push(el);
          sumIncomeAmount += el.amount;
        }
      });
    }
    if (itemType === "all" || itemType === "e") {
      expenseList.forEach((el) => {
        if (
          el.date.getFullYear().toString() === yyyy &&
          (el.date.getMonth() + 1).toString().padStart(2, 0) === mm
        ) {
          itemList.push(el);
          sumExpenseAmount += el.amount;
        }
      });
    }
    sortItem(itemList);

    let gap = sumIncomeAmount - sumExpenseAmount;
    let stringAbsGap = getStringAmount(Math.abs(gap));
    let stringSumIncomeAmount = getStringAmount(sumIncomeAmount);
    let stringSumExpenseAmount = getStringAmount(sumExpenseAmount);

    const cycle = "monthly";
    const now = yyyy + "-" + mm;
    const calendarTitle = yyyy + "-" + mm;

    return res.render("ledger/ledger", {
      pageTitle: "월별 내역",
      itemList,
      prevCalendar,
      now,
      nextCalendar,
      calendarTitle,
      cycle,
      gap,
      stringAbsGap,
      stringSumIncomeAmount,
      stringSumExpenseAmount,
      itemType,
    });
  }

  async getLedgerYearly(req, res, next) {
    const { yyyy, itemType } = req.params;

    const { isParamCorrectValue } = checkParamValue(
      itemType,
      ["i", "e", "all"],
      next
    );
    if (!isParamCorrectValue) return;

    const prevCalendar = (Number(yyyy) - 1).toString();
    const nextCalendar = (Number(yyyy) + 1).toString();

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeList")
        .populate("expenseList");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { incomeList, expenseList } = user;

    let sumIncomeAmount = 0;
    let sumExpenseAmount = 0;

    const itemList = new Array();
    if (itemType === "all" || itemType === "i") {
      incomeList.forEach((el) => {
        if (el.date.getFullYear().toString() === yyyy) {
          itemList.push(el);
          sumIncomeAmount += el.amount;
        }
      });
    }
    if (itemType === "all" || itemType === "e") {
      expenseList.forEach((el) => {
        if (el.date.getFullYear().toString() === yyyy) {
          itemList.push(el);
          sumExpenseAmount += el.amount;
        }
      });
    }
    sortItem(itemList);

    let gap = sumIncomeAmount - sumExpenseAmount;
    let stringAbsGap = getStringAmount(Math.abs(gap));
    let stringSumIncomeAmount = getStringAmount(sumIncomeAmount);
    let stringSumExpenseAmount = getStringAmount(sumExpenseAmount);

    const cycle = "yearly";
    const now = yyyy;
    const calendarTitle = yyyy;

    return res.render("ledger/ledger", {
      pageTitle: "연도별 내역",
      itemList,
      prevCalendar,
      now,
      nextCalendar,
      calendarTitle,
      cycle,
      gap,
      stringAbsGap,
      stringSumIncomeAmount,
      stringSumExpenseAmount,
      itemType,
    });
  }
}

const ledgerController = new LedgerController();

export default ledgerController;
