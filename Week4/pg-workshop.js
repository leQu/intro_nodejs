import { newDb } from "pg-mem";

async function main() {
  // Create an in-memory database instance
  const db = newDb();

  const { Client } = db.adapters.createPg();

  const client = new Client();
  await client.connect();

  console.log("Connected to the in-memory database!");

  // Create a sample table and insert some data
  const initial = await client.query(`
        CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(100)
        );
    `);

  console.log("Table created:", initial.rows);

  /*
   CRUD operations:
  */

  const created = await client.query(
    `
        INSERT INTO users (name, city) VALUES ($1, $2), ($3, $4), ($5, $6), ($7, $8) RETURNING *;
    `,
    [
      "Alice",
      "New York",
      "Bob",
      "Los Angeles",
      "Charlie",
      "Chicago",
      "David",
      "Los Angeles",
    ],
  );

  if (initial.rowCount !== created.rowCount) {
    console.log("All rows inserted successfully");
  }

  console.log("\n\nSample data inserted:", created.rows);

  const read = await client.query(
    `SELECT * FROM users WHERE city = $1 ORDER BY name;`,
    ["Chicago"],
  );
  console.log("\n\nRead user:", read.rows);

  const updated = await client.query(
    `UPDATE users SET city = $1 WHERE city = $2 RETURNING *;`,
    ["Stockholm", "Chicago"],
  );
  console.log("\n\nUpdated user:", updated.rows);

  const deleted = await client.query(
    `DELETE FROM users WHERE city = $1 RETURNING *;`,
    ["Los Angeles"],
  );
  console.log("\n\nDeleted user:", deleted.rows);

  const allUsers = await client.query(`SELECT * FROM users;`);
  console.log("\n\nAll users after operations:", allUsers.rows);

  await client.end();
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
