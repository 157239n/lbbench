import init from "./utils/init.js";
import router from "./routes/index.js";

await init.db();

const beginTime = Date.now() / 1000;

setInterval(() => {
  console.log("Time since server start: " + (Date.now() / 1000 - beginTime));
}, 1000);

(async () => {
  router.listen(8000, () => console.log("App started!"));
})();
