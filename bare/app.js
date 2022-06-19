import express from "express";
import os from "os";
import cluster from "cluster";

/**
 * Runs on 1 core
 */

const setup = (port) => {
  const app = express();

  app.all("/", (req, res) => {
    res.send("Ok");
  });

  app.listen(port, () => console.log("App started!"));
};

if (process.argv.length > 2) {
  console.log("Single process");
  setup(parseInt(process.argv[2]));
} else {
  if (cluster.isMaster) {
    console.log(`Multi process: ${os.cpus().length}`);
    for (let i = 0; i < os.cpus().length; i++) cluster.fork();
    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.id} has exited`);
    });
  } else setup(8000);
}
