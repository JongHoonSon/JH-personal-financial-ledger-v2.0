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
  globalRouter,
  itemRouter,
  lastExpenseRouter,
  ledgerRouter,
  postRouter,
  userRouter,
} from "./routers";
import { localMiddleware, logHistory } from "./middlewares";
import loginRequired from "./middlewares/loginRequired";

const app = express();
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
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(logger);
app.use(localMiddleware);
app.use(logHistory);

app.use("/", globalRouter);

app.use(loginRequired);
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/ledger", ledgerRouter);
app.use("/board", boardRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/chart", chartRouter);
app.use("/last-expense", lastExpenseRouter);

export default app;
