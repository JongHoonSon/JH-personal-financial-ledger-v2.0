import "dotenv/config";
import "./db/db";
import app from "./app";

const PORT = process.env.PORT || 4001;

const handleListening = () =>
  console.log(`express server start! http://localhost:${PORT}/`);

app.listen(PORT, handleListening);
