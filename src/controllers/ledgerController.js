export const getLedgerDaily = (req, res) => {
  res.render("ledger/ledgerDaily", { pageTitle: "Daily Ledger" });
};

export const getLedgerWeekly = (req, res) => {
  res.render("ledger/ledgerWeekly", { pageTitle: "Weekly Ledger" });
};

export const getLedgerMonthly = (req, res) => {
  res.render("ledger/ledgerMonthly", { pageTitle: "Monthly Ledger" });
};

export const getLedgerYearly = (req, res) => {
  res.render("ledger/ledgerYearly", { pageTitle: "Yearly Ledger" });
};
