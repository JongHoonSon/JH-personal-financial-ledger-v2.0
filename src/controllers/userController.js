import { getStringDate, getStringFullDate } from "../utils";
import { userModel } from "./../db/models";
import bcrypt from "bcrypt";

class UserController {
  async getUserProfile(req, res, next) {
    const { userId } = req.params;

    let user;
    try {
      user = await userModel.findById(userId);
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const isMyProfile = req.session.user._id === userId ? true : false;

    let pageTitle = isMyProfile ? "마이페이지" : `${user.nickname}님의 프로필`;

    const joinDate = getStringDate(user.joinDate);
    const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

    return res.render("user/detail-user/detail-user", {
      pageTitle,
      user,
      isMyProfile,
      joinDate,
      lastLoggedInDate,
    });
  }

  getEditUserProfile(req, res) {
    const user = req.session.loggedInUser;

    return res.render("user/edit-user/edit-user-profile", {
      pageTitle: "프로필 수정",
      user,
    });
  }

  async editUserProfile(req, res, next) {
    const { name, nickname, email } = req.body;
    const { file } = req;

    const user = req.session.loggedInUser;

    if (user.nickname !== nickname) {
      try {
        const isExistedNickname = await userModel.exists({ nickname });
        if (isExistedNickname) {
          const error = new Error(
            `해당 닉네임을 사용하는 사용자가 이미 존재합니다.`
          );
          error.statusCode = 400;
          error.redirectURL = "/user/edit-profile";
          next(error);
          return;
        }
      } catch (error) {
        next(error);
        return;
      }
    }

    if (user.email !== email) {
      try {
        const isExistedEmail = await userModel.exists({ email });
        if (isExistedEmail) {
          const error = new Error(
            `해당 이메일을 사용하는 사용자가 이미 존재합니다.`
          );
          error.statusCode = 400;
          error.redirectURL = "/join";
          next(error);
          return;
        }
      } catch (error) {
        next(error);
        return;
      }
    }

    try {
      const filePath = file
        ? `/assets/img/user-upload-images/${file.filename}`
        : user.avatarUrl;
      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {
          name,
          nickname,
          email,
          avatarUrl: filePath,
        },
        { new: true }
      );
      req.session.user = updatedUser;
      req.flash("success", "프로필을 수정했습니다.");
      return res.status(200).json(`/user/profile/${user._id}`);
    } catch (error) {
      next(error);
      return;
    }
  }

  getEditUserPassword(req, res) {
    return res.render("user/edit-user/edit-user-password", {
      pageTitle: "비밀번호 변경",
    });
  }

  async editUserPassword(req, res, next) {
    const { password, new_password, new_password_confirm } = req.body;

    const user = req.session.loggedInUser;

    try {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error("기존 비밀번호가 일치하지 않습니다.");
        error.statusCode = 400;
        error.redirectURL = "/user/edit-password";
        next(error);
        return;
      }
    } catch (error) {
      error.messageToShow = "비밀번호를 검증하는 과정에서 오류가 발생했습니다.";
      error.redirectURL = "/user/edit-password";
      next(error);
      return;
    }

    if (new_password !== new_password_confirm) {
      const error = new Error(
        "입력하신 새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다."
      );
      error.statusCode = 400;
      error.redirectURL = "/user/edit-password ";
      next(error);
      return;
    }

    try {
      user.password = new_password;
      await user.save();
      req.session.user = user;
      req.flash("success", "비밀번호를 변경했습니다.");
      return res.status(200).json(`/user/profile/${user._id}`);
    } catch (error) {
      error.messageToShow = "비밀번호를 변경하는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }
  }

  async getUserOwnCategories(req, res, next) {
    const { categoryType } = req.params;

    const loggedInUser = req.session.user;

    let user;
    let userCategories;
    try {
      if (categoryType === "i") {
        user = await userModel
          .findByIdWithPopulate(loggedInUser._id)
          .populate("incomeCategories");
        userCategories = user.incomeCategories;
      } else if (categoryType === "e") {
        user = await userModel
          .findByIdWithPopulate(loggedInUser._id)
          .populate("expenseCategories");
        userCategories = user.expenseCategories;
      }
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    let pageTitle;

    if (categoryType === "i") {
      pageTitle = `${user.nickname} 님의 수입 카테고리`;
    } else {
      pageTitle = `${user.nickname} 님의 지출 카테고리`;
    }

    return res.render("modal/user-own-categories/user-own-categories", {
      pageTitle,
      userCategories,
      categoryType,
    });
  }

  async addUserCategory(req, res, next) {
    const { categoryType } = req.params;
    const { newCategoryName } = req.body;

    const loggedInUser = req.session.user;

    let user;
    try {
      if (categoryType === "i") {
        user = await userModel
          .findByIdWithPopulate(loggedInUser._id)
          .populate("incomeCategories");
        user.incomeCategories.push(newCategoryName);
      } else if (categoryType === "e") {
        user = await userModel
          .findByIdWithPopulate(loggedInUser._id)
          .populate("expenseCategories");
        user.expenseCategories.push(newCategoryName);
      }
      await user.save();
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    return res.send(200);
  }

  async deleteUserCategory(req, res, next) {
    const { categoryType } = req.params;
    const { categoryName } = req.body;

    const loggedInUser = req.session.user;

    let user;
    try {
      if (categoryType === "i") {
        user = await userModel
          .findByIdWithPopulate(loggedInUser._id)
          .populate("incomeCategories");
        user.incomeCategories = user.incomeCategories.filter(
          (el) => el !== categoryName
        );
      } else if (categoryType === "e") {
        user = await userModel
          .findByIdWithPopulate(loggedInUser._id)
          .populate("expenseCategories");
        user.expenseCategories = user.expenseCategories.filter(
          (el) => el !== categoryName
        );
      }
      await user.save();
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    return res.sendStatus(200);
  }

  async getUserOwnPosts(req, res, next) {
    const { userId } = req.params;

    let user;
    try {
      user = await userModel.findByIdWithPopulate(userId).populate("postList");
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const joinDate = getStringDate(user.joinDate);
    const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

    const isMyProfile = userId === String(user._id) ? true : false;

    return res.render("user/detail-user/user-own-posts", {
      pageTitle: `${user.nickname} 님의 작성 글`,
      isMyProfile,
      user,
      joinDate,
      lastLoggedInDate,
    });
  }

  async getUserOwnComments(req, res, next) {
    const { userId } = req.params;

    let user;
    try {
      user = await userModel.findByIdWithPopulate(userId).populate({
        path: "commentList",
        populate: "post",
      });
    } catch (error) {
      error.messageToShow = "유저를 DB에서 찾는 과정에서 오류가 발생했습니다.";
      next(error);
      return;
    }

    const joinDate = getStringDate(user.joinDate);
    const lastLoggedInDate = getStringFullDate(user.lastLoggedInDate);

    const isMyProfile = userId === String(user._id) ? true : false;

    return res.render("user/detail-user/user-own-comments", {
      pageTitle: `${user.nickname} 님의 작성 댓글`,
      isMyProfile,
      user,
      joinDate,
      lastLoggedInDate,
    });
  }

  async deleteUser(req, res, next) {
    const user = req.session.loggedInUser;

    try {
      await userModel.findByIdAndUpdate(user._id, {
        nickname: "탈퇴한 회원입니다.",
        isDeleted: true,
      });
    } catch (error) {
      next(error);
      return;
    }
    req.session.user = {};
    req.session.loggedIn = false;

    req.flash("success", "정상적으로 회원탈퇴 되었습니다.");
    return res.status(200).json("/login");
  }
}

const userController = new UserController();

export default userController;
