import express from "express";
import ledgerRouter from "./routers/ledgerRouter";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/ledger", ledgerRouter);

export default app;
