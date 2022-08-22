import passport from "passport";
import User from "../models/User";
var GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (userId, done) {
  const user = await User.findById(userId);
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
      const exists = await User.exists({ email: profile.email });

      let user;
      if (exists) {
        user = await User.findOne({ email: profile.email });
      } else {
        try {
          user = await User.create({
            username: profile.id,
            password: "",
            name: profile.given_name + profile.family_name,
            email: profile.email,
            nickname: profile.id,
            socialAccount: true,
            avatarUrl: "defaults/default_avatar.png",
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
