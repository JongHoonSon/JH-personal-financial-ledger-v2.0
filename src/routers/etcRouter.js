import express from "express";
import { getChart } from "../controllers/etcController";

const etcRouter = express.Router();

etcRouter.get("/chart", getChart);

export default etcRouter;
