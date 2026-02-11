import express from "express";

const app = express();

app.use(express.json());

// app.use((req, res, next) => {
//   console.log(`Metod: ${req.method}, URL: ${req.url}`);
//   if (req.body.secret !== "letmein") {
//     return res.status(403).send("Forbidden: Felaktig hemlighet.");
//   }
//   next(); // Gå vidare till nästa steg i kedjan
// });

// app.post("/admin/userdata", (req, res) => {
//   const user = {
//     namn: "Anna Andersson",
//     alder: 28,
//     yrke: "Utvecklare",
//   };
//   res.json(user);
// });

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] Metod: ${req.method}, URL: ${req.url}`,
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Välkommen till min Express-server!");
});

app.get("/om-oss", (req, res) => {
  res.send("Det här är information om mig och min server.");
});

app.get("/kontakt", (req, res) => {
  /*
    1. Hämta information från DB
    2. Transformera data
  */

  res.status(200).send("Kontakta oss på info@example.com");
});

app.get("/produkt/:id", (req, res) => {
  const produkter = [
    { id: 1, namn: "Produkt A", pris: 100 },
    { id: 2, namn: "Produkt B", pris: 200 },
    { id: 3, namn: "Produkt C", pris: 300 },
  ];
  res.json(produkter);
});

app.post("/produkt/:id", (req, res) => {
  const produktId = req.params.id;
  res.send(`Produkt med ID ${produktId} har lags till.`);
});

app.put("/produkt/:id", (req, res) => {
  const produktId = req.params.id;
  res.send(`Produkt med ID ${produktId} har uppdaterats.`);
});

app.delete("/produkt/:id", (req, res) => {
  const produktId = req.params.id;
  res.send(`Produkt med ID ${produktId} har raderats.`);
});

app.get("/allProducts", async (req, res) => {
  // const dataFromApi = await fetch("https://dummyjson.com/products");
  const dataFromApi = {
    products: [
      { id: 1, namn: "Produkt A", pris: 100 },
      { id: 2, namn: "Produkt B", pris: 200 },
      { id: 3, namn: "Produkt C", pris: 300 },
    ],
  };
  res.json(dataFromApi);
});

app.use((req, res) => {
  res.status(404).send("Sidan saknas.");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Express-servern är igång på port ${process.env.PORT || 3000}`);
});
