const express = require("express");
const app = express();
const port = 3000;
const { Worker } = require("worker_threads");

app.get("/non-blocking", (req, res) => {
  res.send("Hello World!");
});
app.get("/block/blocking", (req, res) => {
  const worker = new Worker("./worker.js");
  worker.on("message", (data) => {
    res.send(`result is${data}`);
  });
  worker.on("error", (err) => {
    res.send(err);
  });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
