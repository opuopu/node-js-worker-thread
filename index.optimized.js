const express = require("express");
const app = express();
const port = 3000;
const { Worker } = require("worker_threads");
const THREAD = 2;

function createWorker() {
  return new Promise((resolve, reject) => {
    // send some property
    const worker = new Worker("./woker.optimized.js", {
      workerData: {
        thread: THREAD,
      },
    });

    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (err) => {
      reject(err);
    });
  });
}
app.get("/non-blocking", async (req, res) => {
  res.send("Hello World!");
});
app.get("/block/blocking", async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD; i++) {
    workerPromises.push(createWorker());
  }
  const threadResult = await Promise.all(workerPromises);
  res.send(threadResult);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
