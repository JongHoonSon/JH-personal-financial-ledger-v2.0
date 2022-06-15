import express from "express";
import ledgerRouter from "./routers/ledgerRouter";
import itemRouter from "./routers/itemRouter";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import etcRouter from "./routers/etcRouter";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import { localMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/assets", express.static("assets"));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());
app.use(logger);
app.use(localMiddleware);
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/ledger", ledgerRouter);
app.use("/etc", etcRouter);

export default app;
