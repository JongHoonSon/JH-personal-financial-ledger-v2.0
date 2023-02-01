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

    if (!item) {
      const error = new Error("아이템이 DB에 존재하지 않습니다.");
      error.statusCode = 404;
      error.redirectURL = "/";
      next(error);
    }

    req.session.item = item;
    next();
  } catch (error) {
    next(error);
  }
};

export default checkItemExist;
