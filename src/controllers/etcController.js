export const getChart = (req, res) => {
  res.render("etc/chart", { pageTitle: "소비 리포트" });
};

export const getLastExpense = (req, res) => {
  res.render("etc/lastExpense", { pageTitle: "마지막 지출일" });
};
