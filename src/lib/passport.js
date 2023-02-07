import passport from "passport";
import { userModel } from "./../db/models";
var GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (userId, done) {
  const user = await userModel.findById(userId);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://www.jh-pfl.o-r.kr/auth/google/callback"
          : "http://localhost:4001/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      console.log("profile");
      console.log(profile);

      const exists = await userModel.exists({ email: profile.email });

      let user;
      if (exists) {
        user = await userModel.findOne({ email: profile.email });
      } else {
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
          user = await userModel.create({
            username: profile.id,
            password: "",
            name: profile.displayName,
            email: profile.email,
            nickname: profile.displayName,
            socialAccount: true,
            avatarUrl: "/defaults/images/default-avatar.png",
            incomeCategories,
            expenseCategories,
          });
        } catch (error) {
          console.log(error);
        }
      }

      done(null, user);
    }
  )
);

export default passport;
