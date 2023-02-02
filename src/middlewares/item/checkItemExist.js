import { incomeModel, expenseModel } from "../../db/models";

const checkItemExist = async (req, res, next) => {
  const { itemType, itemId } = req.params;

  try {
    let item;

    if (itemType === "i") {
      item = await incomeModel.findById(itemId);
    } else if (itemType === "e") {
      item = await expenseModel.findById(itemId);
    }
    req.session.item = item;
    next();
  } catch (error) {
    next(error);
    return;
  }
};

export default checkItemExist;
