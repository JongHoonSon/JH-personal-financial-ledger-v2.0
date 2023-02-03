import { userModel } from "./../db/models";
import bcrypt from "bcrypt";

class GlobalController {
  getHome(req, res) {
    return res.status(200).render("global/home", { pageTitle: "홈" });
  }

  getJoin(req, res) {
    return res.status(200).render("global/join", { pageTitle: "회원가입" });
  }

  async join(req, res, next) {
    const { username, password, password_confirm, name, email, nickname } =
      req.body;

    if (password !== password_confirm) {
      const error = new Error(
        "입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다."
      );
      error.statusCode = 400;
      error.redirectURL = "/join";
      next(error);
      return;
    }

    try {
      const isExistedUsername = await userModel.exists({ username });
      if (isExistedUsername) {
        const error = new Error(
          `해당 아이디을 사용하는 사용자가 이미 존재합니다.`
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

    try {
      const isExistedNickname = await userModel.exists({ nickname });
      if (isExistedNickname) {
        const error = new Error(
          `해당 닉네임을 사용하는 사용자가 이미 존재합니다.`
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

    const incomeCategories = [
      "월급",
      "주급",
      "용돈",
      "은행이자",
      "주식이윤",
      "기타",
    ];

    const expenseCategories = [
      "식비",
      "주거비",
      "통신비",
      "교통비",
      "의료비",
      "생활비",
      "의류비",
      "교육비",
      "주식거래",
      "주식손해",
      "기타",
    ];

    try {
      await userModel.create({
        username,
        password,
        name,
        email,
        nickname,
        avatarUrl: "/defaults/images/default-avatar.png",
        incomeCategories,
        expenseCategories,
      });
      req.flash("success", "회원가입에 완료했습니다.");
      return res.status(200).redirect("/login");
    } catch (error) {
      next(error);
      return;
    }
  }

  getLogin(req, res) {
    let saveUsername =
      req.cookies.save_username && req.cookies.save_username === "true"
        ? true
        : false;
    let savedUsername = saveUsername ? req.cookies.saved_username : "";

    return res.status(200).render("global/login", {
      pageTitle: "로그인",
      saveUsername,
      savedUsername,
    });
  }

  async login(req, res, next) {
    const { username, password, save_username } = req.body;

    if (save_username) {
      res.cookie("save_username", "true", { path: "/login", httpOnly: true });
      res.cookie("saved_username", `${username}`, {
        path: "/login",
        httpOnly: true,
      });
    } else {
      res.cookie("save_username", "false", { path: "/login", httpOnly: true });
      res.cookie("saved_username", "", { path: "/login", httpOnly: true });
    }

    let user;
    try {
      user = await userModel.findOne({ username, socialOnly: false });
    } catch (error) {
      error.message = "해당하는 아이디를 갖는 유저가 없습니다.";
      error.redirectURL = "/login";
      next(error);
      return;
    }

    if (user.isDeleted === true) {
      const error = new Error("이미 회원탈퇴한 계정입니다.");
      error.statusCode = 400;
      error.redirectURL = "/login";
      next(error);
      return;
    }

    try {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        const error = new Error("비밀번호가 일치하지 않습니다.");
        error.statusCode = 400;
        error.redirectURL = "/login";
        next(error);
        return;
      }
    } catch (error) {
      error.message = "비밀번호를 검증하는 과정에서 오류가 발생했습니다.";
      error.redirectURL = "/login";
      next(error);
      return;
    }

    try {
      user.lastLoggedInDate = Date.now();
      await user.save();

      req.session.user = user;
      req.session.loggedIn = true;

      req.flash("success", `안녕하세요, ${user.nickname} 님!`);
      return res.status(200).redirect("/");
    } catch (error) {
      error.message = "유저를 DB에 저장하는 과정에서 오류가 발생했습니다.";
      error.redirectURL = "/login";
      next(error);
      return;
    }
  }

  logout(req, res) {
    const { username } = req.session.user;
    req.session.user = null;
    req.session.loggedIn = false;

    req.flash("success", `다음에 또 봬요, ${username} 님!`);
    return res.status(200).redirect("/login");
  }

  finishGoogleLogin(req, res) {
    req.session.user = req.user;
    req.session.loggedIn = true;

    return res.status(200).redirect("/");
  }
}

const globalController = new GlobalController();

export default globalController;
