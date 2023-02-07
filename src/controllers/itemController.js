import { incomeModel, expenseModel, userModel } from "./../db/models";
import { sortItem } from "../utils";
import { checkItemOwner, checkParamValue } from "./../middlewares/";

class ItemController {
  async getAddItem(req, res, next) {
    const { itemType } = req.params;

    const { isParamCorrectValue } = checkParamValue(itemType, ["i", "e"], next);
    if (!isParamCorrectValue) return;

    let pageTitle;

    if (itemType === "e") {
      pageTitle = "지출 내역 추가";
    } else {
      pageTitle = "수입 내역 추가";
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { incomeCategories, expenseCategories } = user;

    return res.render("item/add-item/add-item", {
      pageTitle,
      itemType,
      incomeCategories,
      expenseCategories,
    });
  }

  async addItem(req, res, next) {
    const { itemType } = req.params;
    const { date, amount, category, description, cycle } = req.body;
    const { file } = req;

    const { isParamCorrectValue } = checkParamValue(itemType, ["i", "e"], next);
    if (!isParamCorrectValue) return;

    const { loggedInUser } = req.session;

    let user;
    if (itemType === "i") {
      try {
        user = await userModel
          .findByIdWithPopulate(loggedInUser._id)
          .populate("incomeList");
      } catch (error) {
        error.messageToShow =
          "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
        next(error);
        return;
      }

      try {
        const filePath = file
          ? process.env.NODE_ENV === "production"
            ? file.location
            : `/assets/img/user-upload-images/${file.filename}`
          : "/defaults/images/empty-image.png";
        const newIncome = await incomeModel.create({
          owner: user,
          date,
          amount,
          category,
          description,
          cycle,
          imageUrl: filePath,
        });
        user.incomeList.push(newIncome);
        await user.save();
        req.flash("success", "수입 내역이 추가되었습니다.");
        return res.status(200).redirect("/item/add/i");
      } catch (error) {
        error.messageToShow =
          "수입 내역을 추가하는 과정에서 오류가 발생했습니다.";
        error.redirectURL = "/item/add/i";
        next(error);
        return;
      }
    } else {
      const { paymentMethod } = req.body;

      try {
        user = await userModel
          .findByIdWithPopulate(loggedInUser._id)
          .populate("expenseList");
      } catch (error) {
        error.messageToShow =
          "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
        next(error);
        return;
      }

      try {
        const filePath = file
          ? `/assets/img/user-upload-images/${file.filename}`
          : "/defaults/images/empty-image.png";
        const newExpense = await expenseModel.create({
          owner: user,
          date,
          amount,
          category,
          description,
          cycle,
          paymentMethod,
          imageUrl: filePath,
        });
        user.expenseList.push(newExpense);
        await user.save();
        req.flash("success", "지출 내역이 추가되었습니다.");
        return res.status(200).redirect("/item/add/e");
      } catch (error) {
        error.messageToShow =
          "지출 내역을 추가하는 과정에서 오류가 발생했습니다.";
        error.redirectURL = "/item/add/e";
        next(error);
        return;
      }
    }
  }

  async getEditItem(req, res, next) {
    const { itemType, itemId } = req.params;

    const { isParamCorrectValue } = checkParamValue(itemType, ["i", "e"], next);
    if (!isParamCorrectValue) return;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findByIdWithPopulate(itemId).populate("owner");
      } else {
        item = await expenseModel
          .findByIdWithPopulate(itemId)
          .populate("owner");
      }
    } catch (error) {
      error.messageToShow = "아이템을 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { isOwner } = checkItemOwner(item, user, next);
    if (!isOwner) return;

    const { incomeCategories, expenseCategories } = user;

    return res.render("item/edit-item/edit-item", {
      pageTitle: "내역 수정",
      item,
      itemType,
      incomeCategories,
      expenseCategories,
    });
  }

  async editItem(req, res, next) {
    const { itemType, itemId } = req.params;
    const { date, amount, category, description, cycle } = req.body;
    const { file } = req;

    const { isParamCorrectValue } = checkParamValue(itemType, ["i", "e"], next);
    if (!isParamCorrectValue) return;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findByIdWithPopulate(itemId).populate("owner");
      } else {
        item = await expenseModel
          .findByIdWithPopulate(itemId)
          .populate("owner");
      }
    } catch (error) {
      error.messageToShow = "아이템을 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { isOwner } = checkItemOwner(item, user, next);
    if (!isOwner) return;

    try {
      if (itemType === "e") {
        const { paymentMethod } = req.body;
        item.paymentMethod = paymentMethod;
      }
      const filePath = file
        ? process.env.NODE_ENV === "production"
          ? file.location
          : `/assets/img/user-upload-images/${file.filename}`
        : item.imageUrl;
      item.date = date;
      item.amount = amount;
      item.category = category;
      item.description = description;
      item.cycle = cycle;
      item.imageUrl = filePath;
      await item.save();
      req.flash("success", "아이템을 수정했습니다.");
      return res.status(200).json(`/item/${item.type}/${item.id}`);
    } catch (error) {
      error.messageToShow = "아이템을 수정하는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }
  }

  async deleteItem(req, res, next) {
    const { itemType, itemId } = req.params;

    const { isParamCorrectValue } = checkParamValue(itemType, ["i", "e"], next);
    if (!isParamCorrectValue) return;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findByIdWithPopulate(itemId).populate("owner");
      } else {
        item = await expenseModel
          .findByIdWithPopulate(itemId)
          .populate("owner");
      }
    } catch (error) {
      error.messageToShow = "아이템을 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { isOwner } = checkItemOwner(item, user, next);
    if (!isOwner) return;

    try {
      if (itemType === "i") {
        await incomeModel.findByIdAndDelete(itemId);
        user.incomeList = user.incomeList.filter(
          (income) => String(income._id) !== String(itemId)
        );
        await user.save();
      } else {
        await expenseModel.findByIdAndDelete(itemId);
        user.expenseList = user.expenseList.filter(
          (expense) => String(expense._id) !== String(itemId)
        );
        await user.save();
      }
      req.flash("success", "아이템을 삭제했습니다.");
      if (req.session.history.prevPageURL) {
        return res.status(200).json(req.session.history.prevPageURL);
      }
      return res.status(200).json("/");
    } catch (error) {
      error.messageToShow = "아이템을 삭제하는 과정에서 오류가 발생했습니다.";
      error.redirectURL = `/item/${itemType}/${item.id}`;
      next(error);
      return;
    }
  }

  async getDetailItem(req, res, next) {
    const { itemType, itemId } = req.params;

    const { isParamCorrectValue } = checkParamValue(itemType, ["i", "e"], next);
    if (!isParamCorrectValue) return;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findByIdWithPopulate(itemId).populate("owner");
      } else {
        item = await expenseModel
          .findByIdWithPopulate(itemId)
          .populate("owner");
      }
    } catch (error) {
      error.messageToShow = "아이템을 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { isOwner } = checkItemOwner(item, user, next);
    if (!isOwner) return;

    return res.render("item/detail-item/detail-item", {
      pageTitle: "상세 내역",
      item,
    });
  }

  async getPinnedItems(req, res, next) {
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

    const itemList = new Array();

    const { incomeList, expenseList } = user;

    incomeList.forEach((el) => {
      if (el.pinned === true) {
        itemList.push(el);
      }
    });

    expenseList.forEach((el) => {
      if (el.pinned === true) {
        itemList.push(el);
      }
    });

    sortItem(itemList);

    return res.render("item/pinned-items/pinned-items", {
      pageTitle: "즐겨찾기",
      itemList,
    });
  }

  async pinItem(req, res, next) {
    const { itemType, itemId } = req.params;

    const { isParamCorrectValue } = checkParamValue(itemType, ["i", "e"], next);
    if (!isParamCorrectValue) return;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findByIdWithPopulate(itemId).populate("owner");
      } else {
        item = await expenseModel
          .findByIdWithPopulate(itemId)
          .populate("owner");
      }
    } catch (error) {
      error.messageToShow = "아이템을 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findByIdWithPopulate(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      error.messageToShow = "유저를 불러오는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const { isOwner } = checkItemOwner(item, user, next);
    if (!isOwner) return;

    try {
      if (item.pinned === false) {
        item.pinned = true;
        await item.save();
        req.flash("success", "즐겨찾기에 추가하였습니다.");
        return res.status(200).json(`/item/${itemType}/${item.id}`);
      } else {
        item.pinned = false;
        await item.save();
        req.flash("success", "즐겨찾기에서 삭제하였습니다.");
        return res.status(200).json(`/item/${itemType}/${item.id}`);
      }
    } catch (error) {
      error.message =
        "아이템을 즐겨찾기에 추가하는 과정에서 오류가 발생했습니다.";
      error.redirectURL = `/item/${itemType}/${item.id}`;
      next(error);
      return;
    }
  }
}

const itemController = new ItemController();

export default itemController;
