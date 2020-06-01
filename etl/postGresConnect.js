const pg = require("pg");
const db = new pg.Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "QnA",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("connect");
});

module.exports = db;
