import express from "express";
import ledgerRouter from "./routers/ledgerRouter";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";

const app = express();

app.use("/", rootRouter);
app.use("/user", userRouter);
app.use("/ledger", ledgerRouter);

export default app;
