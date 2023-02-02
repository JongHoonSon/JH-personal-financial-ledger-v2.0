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
      callbackURL: "http://localhost:4001/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const exists = await userModel.exists({ email: profile.email });

      let user;
      if (exists) {
        user = await userModel.findOne({ email: profile.email });
      } else {
        try {
          user = await userModel.create({
            username: profile.id,
            password: "",
            name: profile.given_name + profile.family_name,
            email: profile.email,
            nickname: profile.id,
            socialAccount: true,
            avatarUrl: "/defaults/images/default-avatar.png",
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
