// const pg = require("pg");
// const db = new pg.Client({
//   host: "localhost",
//   port: 5432,
//   user: "postgres",
//   password: "password",
//   database: "QnA",
// });

// db.connect((err) => {
//   if (err) console.log(err);
//   else console.log("connect");
// });

const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "QnA",
  max: 15,
  idleTimeoutMillis: 15000,
});

pool.on("connect", () => {
  return console.log("connected");
});

module.exports = pool;

// module.exports = db;
