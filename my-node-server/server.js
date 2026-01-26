import express from "express";

import router from "./routes/index.js";
import middleware from "./middleware/index.js";

const app = express();
const PORT = process.env.PORT || 3000;
let requestAmount = 0;

app.use((req, res, next) => {
  requestAmount++;
  next();
});

middleware(app);
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Starting server at http://localhost:${PORT}`);
});
