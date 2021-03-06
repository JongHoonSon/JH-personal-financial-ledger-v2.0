import "dotenv/config";
import "./db";
import "./models/User";
import "./models/Expense";
import "./models/Income";
import app from "./server";

const PORT = process.env.PORT || 4001;

const handleListening = () =>
  console.log(`express server start! http://localhost:${PORT}/`);

app.listen(PORT, handleListening);
