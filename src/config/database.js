const { Pool } = require('pg');
const neo4j = require('neo4j-driver');
require('dotenv').config();

let postgresPool;

try {
   postgresPool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });
  
  console.log("=======", postgresPool)
} catch (error) {
  console.log('-----------', error)
}

const neo4jDriver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

module.exports = { postgresPool, neo4jDriver };