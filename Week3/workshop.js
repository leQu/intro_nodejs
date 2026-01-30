import fsPromise from "fs/promises";
import fsCallback, { read } from "fs";

/*
    UPPGIFT 1:
*/

function runFirstTask() {
  console.log("First task started...");
  fsCallback.readFile("text.txt", "utf8", (error, data) => {
    if (error) {
      console.error("Error reading file:", error);
    }
    console.log("\nData from file with callback:\n", data, "\n\n");
  });
}
runFirstTask();

/*
    UPPGIFT 2:
*/

async function runSecondTask() {
  console.log("Second task started...");
  try {
    const data = await fsPromise.readFile("text.txt", "utf8");
    console.log("\nData from file with promises:\n", data, "\n\n");
  } catch (error) {
    console.error("Error reading file:", error);
  }
}
runSecondTask();

/*
    Uppgift 2b (BONUS):
*/

function runSecondTaskBonus() {
  console.log("Second task bonus started...");
  fsPromise
    .readFile("text.txt", "utf8")
    .then((data) => {
      console.log("\nData from file with promises (bonus):\n", data, "\n\n");
    })
    .catch((error) => {
      console.error("Error reading file:", error);
    });
}
runSecondTaskBonus();

/*
    UPPGIFT 3:
*/

async function runThirdTask() {
  console.log("Third task started...");

  const readStream = fsCallback.createReadStream("largefile.txt", {
    encoding: "utf8",
    highWaterMark: 1024 * 1024, // 1 MB
  });

  const writeStream = fsCallback.createWriteStream("copy_largefile.txt", {
    encoding: "utf8",
  });

  readStream.on("data", (chunk) => {
    console.log(`Read ${chunk.length} bytes`);
  });

  readStream.on("error", (error) => {
    console.error("Error reading file:", error);
  });

  writeStream.on("finish", () => {
    console.log("Finished writing to file.");
  });

  writeStream.on("error", (error) => {
    console.error("Error writing file:", error);
  });

  readStream.pipe(writeStream);
}
runThirdTask();

function generateLargeFile(size) {
  let written = 0;
  const stream = fsCallback.createWriteStream("largefile.txt", {
    encoding: "utf8",
  });
  const chunk = Buffer.alloc(1024 * 1024, "a");

  function write() {
    while (written <= size) {
      if (!stream.write(chunk)) {
        stream.once("drain", write);
        return;
      }
      written += chunk.length;
    }
    stream.end();
  }
  write();
}

// generateLargeFile(500 * 1024 * 1024); // 500 MB
