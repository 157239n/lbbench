import express from "express";

const app = express();

app.all("/", (req, res) => {
  res.send("Ok");
});

console.log(process.argv);

let port;
try {
  port = parseInt(process.argv[2]);
} catch (e) {
  port = 8000;
}

(async () => {
  app.listen(port, () => console.log("App started!"));
})();
