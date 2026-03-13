const redis = require("redis");
const client = redis.createClient();
client.on("error", (err) => console.error("Redis-fel:", err));
client.connect();

app.get("/data", async (req, res) => {
  const cacheKey = "dataKey";
  try {
    // Kontrollera om data redan finns i cache
    const cachedData = await client.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    // Om inget finns i cache, hämta data från databasen
    const data = await getDataFromDatabase();
    // Lagra data i cache med en tidsbegränsning (t.ex. 60sekunder)
    await client.setEx(cacheKey, 60, JSON.stringify(data));
    res.json(data);
  } catch (err) {
    res.status(500).send("Ett fel uppstod.");
  }
});

const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master-process körs: ${process.pid}`);
  // Starta en worker-process för varje CPU-kärna
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker-process ${worker.process.pid} avslutades`);
  });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("Server svarar!");
    })
    .listen(8000);
  console.log(`Worker-process körs: ${process.pid}`);
}

const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;

const skip = (page - 1) * limit;
const products = await Products.find().skip(skip).limit(limit);
res.json(products);
