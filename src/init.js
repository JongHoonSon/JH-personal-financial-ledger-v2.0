import "dotenv/config";
import "./db";
import app from "./server";

const PORT = process.env.PORT || 4001;

const handleListening = () =>
  console.log(`express server start! http://localhost:${PORT}/`);

app.listen(PORT, handleListening);
