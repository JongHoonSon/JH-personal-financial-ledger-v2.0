export const getAddItem = (req, res) => {
  res.render("item/addItem", { pageTitle: "Add Item" });
};

export const postAddItem = (req, res) => {};

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
