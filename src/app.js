const express = require("express");

const app = express();

const port = app.listen(5050);

app.get("/", function (req, res) {
  res.send("<h1>Hello</h1>");
});

app.listen(port, function () {
  console.log(`express server start! http://localhost:5050/`);
});
