const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection
  // connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Database connected successfully at:", res.rows[0].now);
  }
});

// Example of using a transaction
async function transferFunds(fromAccountId, toAccountId, amount) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromAccountId]
    );

    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toAccountId]
    );

    await client.query("COMMIT");
    return true;
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

// const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = new Sequelize(/* connection config */);

// const User = sequelize.define("User", {
//   name: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true,
//   },
// });

// module.exports = User;

module.exports = {
  query: (text, params) => pool.query(text, params),
};
