const axios = require("axios");
const moment = require("moment");

const greet = require("./greeting");

const currentDate = moment().format("YYYY-MM-DD");

console.log("Welcome to Week 1 Lecture!", currentDate);

console.log(greet("Student"));

axios.get("https://api.github.com").then((response) => {
  console.log("GitHub API Status:", response.status);
});
