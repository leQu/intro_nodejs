const { newDb } = require("pg-mem");

async function main() {
  // 1) Create an in-memory Postgres-like database
  const db = newDb();

  // 2) Create a pg-compatible adapter (so we can use "pg" Client)
  const { Client } = db.adapters.createPg();

  const client = new Client();
  await client.connect();

  console.log("Connected to pg-mem (in-memory Postgres)");

  // 3) Create table
  await client.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name TEXT,
      age INT
    );
  `);

  // =====================
  // CRUD OPERATIONS
  // =====================

  // CREATE
  const created = await client.query(
    "INSERT INTO users(name, age) VALUES ($1, $2) RETURNING *",
    ["Alice", 30]
  );
  console.log("CREATE:", created.rows[0]);

  // READ
  const read = await client.query("SELECT * FROM users ORDER BY id");
  console.log("READ:", read.rows);

  // UPDATE
  const updated = await client.query(
    "UPDATE users SET age = $1 WHERE name = $2 RETURNING *",
    [31, "Alice"]
  );
  console.log("UPDATE:", updated.rows[0]);

  // DELETE
  await client.query("DELETE FROM users WHERE name = $1", ["Alice"]);
  const remaining = await client.query("SELECT * FROM users ORDER BY id");
  console.log("DELETE:", remaining.rows);

  // Clean up
  await client.end();
}

main().catch(console.error);
