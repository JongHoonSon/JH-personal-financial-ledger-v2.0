import { unauthorizedAccess } from "../middlewares";
import { getStringDate, getStringFullDate } from "../utils";
import User from "../models/User";
import bcrypt from "bcrypt";

class UserController {
  async getUserProfile(req, res) {
    const { userId } = req.params;

    let user;
    try {
      user = await User.findById(userId);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    const isMyProfile = req.session.user._id === userId ? true : false;

    let pageTitle = isMyProfile ? "마이페이지" : `${user.nickname}님의 프로필`;

    const joinDate = getStringDate(user.joinDate);
    const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

    res.render("user/detail-user/detail-user", {
      pageTitle,
      user,
      isMyProfile,
      joinDate,
      lastLoggedInDate,
    });
  }

  async getEditUserProfile(req, res) {
    const loggedInUserId = req.session.user._id;

    let user;
    try {
      user = await User.findById(loggedInUserId);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    return res.render("user/edit-user/edit-user-profile", {
      pageTitle: "프로필 수정",
      user,
    });
  }

  async postEditUserProfile(req, res) {
    const loggedInUserId = req.session.user._id;
    const { name, nickname, email } = req.body;
    const { file } = req;

    let user;
    try {
      user = await User.findById(loggedInUserId);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    if (user.nickname !== nickname) {
      let existedNickname;
      try {
        existedNickname = await User.exists({ nickname });
      } catch (error) {
        console.log(error);
        req.flash(
          "error",
          "유저 정보를 불러오는 과정에서 오류가 발생했습니다."
        );
        return res.status(500).redirect("/");
      }
      if (existedNickname) {
        req.flash("error", "이미 사용 중인 닉네임입니다.");
        return res.status(400).redirect("/join");
      }
    }

    if (user.email !== email) {
      let existedEmail;
      try {
        existedEmail = await User.exists({ email });
      } catch (error) {
        console.log(error);
        req.flash(
          "error",
          "유저 정보를 불러오는 과정에서 오류가 발생했습니다."
        );
        return res.status(500).redirect("/");
      }
      if (existedEmail) {
        req.flash("error", "이미 사용 중인 이메일입니다.");
        return res.status(400).redirect("/join");
      }
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          name,
          nickname,
          email,
          avatarUrl: file ? file.path : user.avatarUrl,
        },
        { new: true }
      );
      req.session.user = updatedUser;
      req.flash("success", "프로필을 수정했습니다.");
      return res.status(200).redirect(`/user/profile/${user._id}`);
    } catch (error) {
      console.log(error);
      req.flash("error", "프로필을 수정하는 과정에서 오류가 발생했습니다.");
      return res.status(400).redirect(`/user/profile/${user._id}`);
    }
  }

  async getEditUserPassword(req, res) {
    const loggedInUserId = req.session.user._id;

    let user;
    try {
      user = await User.findById(loggedInUserId);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    return res.render("user/edit-user/edit-user-password", {
      pageTitle: "비밀번호 변경",
    });
  }

  async postEditUserPassword(req, res) {
    const loggedInUserId = req.session.user._id;
    const { password, new_password, new_password_confirm } = req.body;

    let user;
    try {
      user = await User.findById(loggedInUserId);
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    let passwordCorrect;
    try {
      passwordCorrect = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.log(error);
      req.flash("error", "비밀번호를 검증하는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!passwordCorrect) {
      req.flash("error", "비밀번호가 일치하지 않습니다.");
      return res.status(400).redirect(`/user/edit-password`);
    }

    if (new_password !== new_password_confirm) {
      req.flash(
        "error",
        "입력하신 새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다."
      );
      return res.status(400).redirect(`/user/edit-password`);
    }

    try {
      user.password = new_password;
      await user.save();
      req.session.user = user;
      req.flash("success", "비밀번호를 변경했습니다.");
      return res.status(200).redirect(`/user/profile/${user._id}`);
    } catch (error) {
      console.log(error);
      req.flash("error", "비밀번호를 변경하는 과정에서 오류가 발생했습니다.");
      return res.status(400).redirect(`/user/edit-password`);
    }
  }

  async getUserOwnCategories(req, res) {
    const loggedInUserId = req.session.user._id;
    const { categoryType } = req.params;

    let user;
    let userCategories;
    try {
      if (categoryType === "i") {
        user = await User.findById(loggedInUserId).populate("incomeCategories");
        userCategories = user.incomeCategories;
      } else if (categoryType === "e") {
        user = await User.findById(loggedInUserId).populate(
          "expenseCategories"
        );
        userCategories = user.expenseCategories;
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }

    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    let pageTitle;

    if (categoryType === "i") {
      pageTitle = `${user.nickname} 님의 수입 카테고리`;
    } else {
      pageTitle = `${user.nickname} 님의 지출 카테고리`;
    }

    res.render("modal/user-own-categories/user-own-categories", {
      pageTitle,
      userCategories,
      categoryType,
    });
  }

  async postAddUserCategory(req, res) {
    const loggedInUserId = req.session.user._id;
    const { categoryType } = req.params;
    const { newCategoryName } = req.body;

    let user;
    try {
      if (categoryType === "i") {
        user = await User.findById(loggedInUserId).populate("incomeCategories");
        user.incomeCategories.push(newCategoryName);
      } else if (categoryType === "e") {
        user = await User.findById(loggedInUserId).populate(
          "expenseCategories"
        );
        user.expenseCategories.push(newCategoryName);
      }
      await user.save();
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }

    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    return res.send(200);
  }

  async postDeleteUserCategory(req, res) {
    const loggedInUserId = req.session.user._id;
    const { categoryType } = req.params;
    const { categoryName } = req.body;

    let user;
    try {
      if (categoryType === "i") {
        user = await User.findById(loggedInUserId).populate("incomeCategories");
        user.incomeCategories = user.incomeCategories.filter(
          (el) => el !== categoryName
        );
      } else if (categoryType === "e") {
        user = await User.findById(loggedInUserId).populate(
          "expenseCategories"
        );
        user.expenseCategories = user.expenseCategories.filter(
          (el) => el !== categoryName
        );
      }
      await user.save();
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }

    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    return res.sendStatus(200);
  }

  async getUserOwnPosts(req, res) {
    const { userId } = req.params;

    let user;
    try {
      user = await User.findById(userId).populate("postList");
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }

    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    const joinDate = getStringDate(user.joinDate);
    const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

    res.render("user/detail-user/user-own-posts", {
      pageTitle: `${user.nickname} 님의 작성 글`,
      user,
      joinDate,
      lastLoggedInDate,
    });
  }

  async getUserOwnComments(req, res) {
    const { userId } = req.params;

    let user;
    try {
      user = await User.findById(userId).populate({
        path: "commentList",
        populate: "post",
      });
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }

    if (!user) {
      req.flash("error", "유저를 찾을 수 없습니다.");
      return res.status(404).redirect("/");
    }

    const joinDate = getStringDate(user.joinDate);
    const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

    res.render("user/detail-user/user-own-comments", {
      pageTitle: `${user.nickname} 님의 작성 댓글`,
      user,
      joinDate,
      lastLoggedInDate,
    });
  }
}

const userController = new UserController();

export default userController;
