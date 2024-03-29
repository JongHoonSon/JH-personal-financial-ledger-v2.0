import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import passport from "passport";
import {
  boardRouter,
  chartRouter,
  commentRouter,
  postRouter,
  globalRouter,
  itemRouter,
  lastExpenseRouter,
  ledgerRouter,
  userRouter,
} from "./routers";

import {
  saveResponseLocalData,
  logPathHistory,
  checkUserLoggedIn,
  checkUserExist,
  errorHandler,
  createDefaultData,
} from "./middlewares";

export const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/assets", express.static("assets"));
app.use("/defaults", express.static("defaults"));
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        process.env.NODE_ENV === "production"
          ? process.env.DEPLOY_DB_URL
          : process.env.LOCAL_DB_URL,
    }),
  })
);

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(logger);
app.use(saveResponseLocalData);
app.use(logPathHistory);
app.use(createDefaultData);

app.use("/", globalRouter);

app.use(checkUserLoggedIn);
app.use(checkUserExist);
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/ledger", ledgerRouter);
app.use("/board", boardRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/chart", chartRouter);
app.use("/last-expense", lastExpenseRouter);

app.get("*", (req, res) => {
  return res.status(404).render("not-found/not-found");
});

app.use(errorHandler);
