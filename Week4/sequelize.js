const { Sequelize, DataTypes } = require("sequelize");

async function main() {
  // 1) Connect to Postgres
  const sequelize = new Sequelize("databas_namn", "användarnamn", "lösenord", {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false,
  });

  await sequelize.authenticate();
  console.log("Connected to Postgres with Sequelize");

  // 2) Define model (maps to a table)
  const User = sequelize.define(
    "User",
    {
      name: { type: DataTypes.STRING(100) },
      age: { type: DataTypes.INTEGER },
    },
    {
      tableName: "users",
      timestamps: false, // keep it simple
    }
  );

  // 3) Ensure table exists (demo-friendly)
  await User.sync(); // creates "users" if it doesn't exist

  // =====================
  // CRUD
  // =====================

  // CREATE
  const created = await User.create({ name: "Alice", age: 30 });
  console.log("CREATE:", created.toJSON());

  // READ
  const all = await User.findAll({ order: [["id", "ASC"]] });
  console.log("READ:", all.map((u) => u.toJSON()));

  // UPDATE
  await User.update({ age: 31 }, { where: { name: "Alice" } });
  const updated = await User.findOne({ where: { name: "Alice" } });
  console.log("UPDATE:", updated.toJSON());

  // DELETE
  await User.destroy({ where: { name: "Alice" } });
  const remaining = await User.findAll();
  console.log("DELETE:", remaining.map((u) => u.toJSON()));

  // 4) Close connection
  await sequelize.close();
  console.log("Done");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
