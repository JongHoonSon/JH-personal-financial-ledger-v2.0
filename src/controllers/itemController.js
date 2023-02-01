import { incomeModel, expenseModel, userModel } from "./../db/models";
import { sortItem } from "../utils";

class ItemController {
  async getAddItem(req, res) {
    const { itemType } = req.params;

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
        .findById(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    const { incomeCategories, expenseCategories } = user;

    return res.render("item/add-item/add-item", {
      pageTitle,
      itemType,
      incomeCategories,
      expenseCategories,
    });
  }

  async addItem(req, res) {
    const { itemType } = req.params;
    const { date, amount, category, description, cycle } = req.body;
    const { file } = req;

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel.findById(loggedInUser._id);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    if (itemType === "i") {
      try {
        const user = await userModel.findById(loggedInUser._id);
        const filePath = file
          ? `/assets/img/user-upload-images/${file.filename}`
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
        console.log(error);
        req.flash(
          "error",
          "수입 내역을 추가하는 과정에서 오류가 발생했습니다."
        );
        return res.status(500).redirect("/item/add/i");
      }
    } else {
      const { paymentMethod } = req.body;
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
        console.log(error);
        req.flash(
          "error",
          "지출 내역을 추가하는 과정에서 오류가 발생했습니다."
        );
        return res.status(500).redirect("/item/add/e");
      }
    }
  }

  async getEditItem(req, res) {
    const { itemType, itemId } = req.params;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findById(itemId).populate("owner");
      } else {
        item = await expenseModel.findById(itemId).populate("owner");
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "아이템을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!item) {
      req.flash("error", "아이템을 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findById(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    if (String(item.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(403).redirect("/");
    }

    const { incomeCategories, expenseCategories } = user;

    return res.render("item/edit-item/edit-item", {
      pageTitle: "내역 수정",
      item,
      itemType,
      incomeCategories,
      expenseCategories,
    });
  }

  async editItem(req, res) {
    const { itemType, itemId } = req.params;
    const { date, amount, category, description, cycle } = req.body;
    const { file } = req;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findById(itemId).populate("owner");
      } else {
        item = await expenseModel.findById(itemId).populate("owner");
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "아이템을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }
    if (!item) {
      req.flash("error", "아이템을 찾을 수 없습니다.");
      return res.status(404).json({ haveToRedirect: true, redirectURL: "/" });
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findById(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).json({ haveToRedirect: true, redirectURL: "/" });
    }

    if (String(item.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(403).json({ haveToRedirect: true, redirectURL: "/" });
    }

    try {
      if (itemType === "e") {
        const { paymentMethod } = req.body;
        item.paymentMethod = paymentMethod;
      }
      const filePath = file
        ? `/assets/img/user-upload-images/${file.filename}`
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
      console.log(error);
      req.flash("error", "아이템을 수정하는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({
        haveToRedirect: true,
        redirectURL: `/item/${item.type}/${item.id}`,
      });
    }
  }

  async deleteItem(req, res) {
    const { itemType, itemId } = req.params;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findById(itemId).populate("owner");
      } else {
        item = await expenseModel.findById(itemId).populate("owner");
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "아이템을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }
    if (!item) {
      req.flash("error", "아이템을 찾을 수 없습니다.");
      return res.status(404).json({ haveToRedirect: true, redirectURL: "/" });
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findById(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: "/" });
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).json({ haveToRedirect: true, redirectURL: "/" });
    }

    if (String(item.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(403).json({ haveToRedirect: true, redirectURL: "/" });
    }

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
      console.log(error);
      req.flash("error", "아이템을 삭제하는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({
        haveToRedirect: true,
        redirectURL: `/item/${itemType}/${item.id}`,
      });
    }
  }

  async getDetailItem(req, res) {
    const { itemType, itemId } = req.params;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findById(itemId).populate("owner");
      } else {
        item = await expenseModel.findById(itemId).populate("owner");
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "아이템을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!item) {
      req.flash("error", "아이템을 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findById(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    if (String(item.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(403).redirect("/");
    }

    return res.render("item/detail-item/detail-item", {
      pageTitle: "상세 내역",
      item,
    });
  }

  async getPinnedItems(req, res) {
    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findById(loggedInUser._id)
        .populate("incomeList")
        .populate("expenseList");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
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
      pageTitle: "핀 목록",
      itemList,
    });
  }

  async pinItem(req, res) {
    const { itemType, itemId } = req.params;

    let item;
    try {
      if (itemType === "i") {
        item = await incomeModel.findById(itemId).populate("owner");
      } else {
        item = await expenseModel.findById(itemId).populate("owner");
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "아이템을 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: `/` });
    }
    if (!item) {
      req.flash("error", "아이템을 찾을 수 없습니다.");
      return res.status(404).json({ haveToRedirect: true, redirectURL: `/` });
    }

    const loggedInUser = req.session.user;
    let user;
    try {
      user = await userModel
        .findById(loggedInUser._id)
        .populate("incomeCategories")
        .populate("expenseCategories");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).json({ haveToRedirect: true, redirectURL: `/` });
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).json({ haveToRedirect: true, redirectURL: `/` });
    }

    if (String(item.owner._id) !== String(user._id)) {
      req.flash("error", "권한이 없습니다.");
      return res.status(403).json({ haveToRedirect: true, redirectURL: `/` });
    }

    try {
      if (item.pinned === false) {
        item.pinned = true;
        await item.save();
        req.flash("success", "핀 목록에 추가하였습니다.");
        return res.status(200).json(`/item/${itemType}/${item.id}`);
      } else {
        item.pinned = false;
        await item.save();
        req.flash("success", "핀 목록에서 삭제하였습니다.");
        return res.status(200).json(`/item/${itemType}/${item.id}`);
      }
    } catch (error) {
      console.log(error);
      req.flash(
        "error",
        "아이템을 핀 목록에 추가하는 과정에서 오류가 발생했습니다."
      );
      return res.status(500).json({
        haveToRedirect: true,
        redirectURL: `/item/${itemType}/${item.id}`,
      });
    }
  }
}

export const itemController = new ItemController();
