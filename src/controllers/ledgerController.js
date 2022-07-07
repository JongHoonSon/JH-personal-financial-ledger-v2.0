export const getLedgerDaily = (req, res) => {
  res.render("ledger/ledgerDaily", { pageTitle: "일별 내역" });
};

export const getLedgerWeekly = (req, res) => {
  res.render("ledger/ledgerWeekly", { pageTitle: "주별 내역" });
};

export const getLedgerMonthly = (req, res) => {
  res.render("ledger/ledgerMonthly", { pageTitle: "월별 내역" });
};

export const getLedgerYearly = (req, res) => {
  res.render("ledger/ledgerYearly", { pageTitle: "연별 내역" });
};
