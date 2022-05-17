import express from "express";

const app = express();

const PORT = process.env.PORT || 4000;

app.get("/", function (req, res) {
  res.send("<h1>Hello</h1>");
});

const handleListening = () =>
  console.log(`express server start! http://localhost:${PORT}/`);

app.listen(PORT, handleListening);
