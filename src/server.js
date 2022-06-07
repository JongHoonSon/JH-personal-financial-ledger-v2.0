import express from "express";
import ledgerRouter from "./routers/ledgerRouter";
import itemRouter from "./routers/itemRouter";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import etcRouter from "./routers/etcRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/assets", express.static("assets"));

app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/ledger", ledgerRouter);
app.use("/", etcRouter);

export default app;
