import fs from "fs";
import http from "http";
import chalk from "chalk";

import greet from "./greeting.js";

console.log("Hello world");

const data = fs.readFileSync("text.txt", "utf8");
console.log(data);

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`${greet("Alexander")}\nHär är innehållet i text.txt:\n${data}`);
});

server.listen(3000, () => {
  console.log(`Server is listening on ${chalk.green.bgRed("port 3000")}`);
});
