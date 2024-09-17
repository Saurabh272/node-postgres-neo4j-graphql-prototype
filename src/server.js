const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const { postgresPool, neo4jDriver } = require('./config/database');
require('dotenv').config();

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize databases with sample data
  await initDatabases();
});

async function initDatabases() {
  const { users, posts } = require('../data.json');

  // Initialize PostgreSQL
  await postgresPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    )
  `);

  for (const user of users) {
    await postgresPool.query(
      'INSERT INTO users (id, name, email) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
      [user.id, user.name, user.email]
    );
  }

  // Initialize Neo4j
  const session = neo4jDriver.session();
  try {
    await session.run('CREATE CONSTRAINT IF NOT EXISTS ON (u:User) ASSERT u.id IS UNIQUE');
    await session.run('CREATE CONSTRAINT IF NOT EXISTS ON (p:Post) ASSERT p.id IS UNIQUE');

    for (const user of users) {
      await session.run(
        'MERGE (u:User {id: $id}) SET u.name = $name, u.email = $email',
        user
      );
    }

    for (const post of posts) {
      await session.run(
        'MERGE (p:Post {id: $id}) SET p.title = $title, p.content = $content ' +
        'WITH p ' +
        'MATCH (u:User {id: $userId}) ' +
        'MERGE (u)-[:AUTHORED]->(p)',
        post
      );
    }
  } finally {
    await session.close();
  }

  console.log('Databases initialized with sample data');
}