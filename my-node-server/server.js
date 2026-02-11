import express from "express";

import { users } from "./routes/index.js";
import middleware from "./middleware/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

middleware(app);

app.use("/users", users);

app.listen(PORT, () => {
  console.log(`Starting server at http://localhost:${PORT}`);
});
