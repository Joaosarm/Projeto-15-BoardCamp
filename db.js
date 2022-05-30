import pg from "pg";

const {Pool} = pg;
const db = new Pool({
  host: "localhost",
  port: 5432,
  user: "joaosarmento",
  password: process.env.PASS, 
  database: "postgres"
});

export default db;