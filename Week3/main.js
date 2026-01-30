import fs from "fs";

function fetchDataCallbacks() {
  fs.readFile("text.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
    data.json((err, data) => {
      if (err) {
        console.error("Error parsing JSON:", err);
        return;
      }
      console.log("Data read successfully!", data);
      fetch(data[0].url, (err, fetchData) => {
        if (err) {
          console.error("Error fetching data:", err);
          return;
        }
        console.log("Data fetched successfully!", fetchData);
      });
    });
  });
}

const allData = {};

function fecthDataPromises() {
  const url = "https://dummyjson.com/products/2";

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Data fetched successfully!", data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function fetchDataAsyncAwait() {
  try {
    const response = await fetch("https://dummyjson.com/products/2");
    const data = await response.json();
    console.log(data);
    allData[url] = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function readStreamExample() {
  const readStream = fs.createReadStream("largefile.txt", {
    encoding: "utf8",
    highWaterMark: 64,
  });
}

console.log("Running script...");

//fetchDataCallbacks();
//fecthDataPromises();
fetchDataAsyncAwait();

console.log("Finishing script...");
