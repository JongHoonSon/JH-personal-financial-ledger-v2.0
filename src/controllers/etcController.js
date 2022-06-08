export const getChart = (req, res) => {
  res.render("etc/chart", { pageTitle: "Chart" });
};

export const getLastExpense = (req, res) => {
  res.render("etc/lastExpense", { pageTitle: "Last Expense" });
};
