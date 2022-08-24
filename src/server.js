import express from "express";
import ledgerRouter from "./routers/ledgerRouter";
import itemRouter from "./routers/itemRouter";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import etcRouter from "./routers/etcRouter";
import boardRouter from "./routers/boardRouter";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import cookieParser from "cookie-parser";
import passport from "passport";
import { localMiddleware, createObjectMiddleware } from "./middlewares";
import postRouter from "./routers/postRouter";
import commentRouter from "./routers/CommentRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/assets", express.static("assets"));

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
app.use(createObjectMiddleware);
app.use(localMiddleware);
app.use("/defaults", express.static("defaults"));
app.use("/uploads", express.static("uploads"));
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/ledger", ledgerRouter);
app.use("/board", boardRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/etc", etcRouter);

export default app;
