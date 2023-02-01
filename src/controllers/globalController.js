import { userModel } from "./../db/models";
import bcrypt from "bcrypt";

class GlobalController {
  getHome(req, res) {
    return res.status(200).render("global/home", { pageTitle: "홈" });
  }

  getJoin(req, res) {
    return res.status(200).render("global/join", { pageTitle: "회원가입" });
  }

  async join(req, res) {
    const { username, password, password_confirm, name, email, nickname } =
      req.body;

    if (password !== password_confirm) {
      req.flash(
        "error",
        "입력하신 비밀번호와 비밀번호 확인이 일치하지 않습니다."
      );
      return res.status(400).redirect("/join");
    }

    let existedUsername;
    try {
      existedUsername = await User.exists({ username });
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 찾는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (existedUsername) {
      req.flash("error", "이미 사용 중인 아이디입니다.");
      return res.status(400).redirect("/join");
    }

    let existedEmail;
    try {
      existedEmail = await User.exists({ email });
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 찾는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (existedEmail) {
      req.flash("error", "이미 사용 중인 이메일입니다.");
      return res.status(400).redirect("/join");
    }

    let existedNickname;
    try {
      existedNickname = await User.exists({ nickname });
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 찾는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (existedNickname) {
      req.flash("error", "이미 사용 중인 닉네임입니다.");
      return res.status(400).redirect("/join");
    }

    try {
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

      await User.create({
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
      console.log(error);
      req.flash("error", "유저를 생성하는 과정에서 오류가 발생했습니다.");
      return res.status(400).redirect("/join");
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

  async login(req, res) {
    const { username, password, save_username } = req.body;

    let user;
    try {
      user = await User.findOne({ username, socialOnly: false });
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!user) {
      req.flash("error", "입력하신 아이디는 없는 아이디입니다.");
      return res.status(400).redirect("/login");
    }

    let isPasswordCorrect;
    try {
      isPasswordCorrect = await bcrypt.compare(password, user.password);
    } catch (error) {
      console.log(error);
      req.flash("error", "비밀번호를 검증하는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }
    if (!isPasswordCorrect) {
      req.flash("error", "비밀번호가 일치하지 않습니다.");
      return res.status(400).redirect("/login");
    }

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

    try {
      user.lastLoggedInDate = Date.now();
      await user.save();
    } catch (error) {
      console.log(error);
      req.flash("error", "유저를 불러오는 과정에서 오류가 발생했습니다.");
      return res.status(500).redirect("/");
    }

    req.session.user = user;
    req.session.loggedIn = true;

    req.flash("success", `안녕하세요, ${user.nickname} 님!`);
    return res.status(200).redirect("/");
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

export const globalController = new GlobalController();
