const express = require("express");
const jobs = require("./jobs");
const app = express();
const port = 4000;

app.get("/", (req, res) => {
  res.send("Welcome to the Job Application Tracker API!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});