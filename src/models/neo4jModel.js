const { neo4jDriver } = require('../config/database');

const getPostById = async (id) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      'MATCH (p:Post {id: $id}) RETURN p',
      { id }
    );
    return result.records[0]?.get('p').properties;
  } finally {
    await session.close();
  }
};

const getPostsByUser = async (userId) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      'MATCH (u:User {id: $userId})-[:AUTHORED]->(p:Post) RETURN p',
      { userId }
    );
    return result.records.map(record => record.get('p').properties);
  } finally {
    await session.close();
  }
};

const createPost = async (title, content, userId) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      'CREATE (p:Post {id: randomUUID(), title: $title, content: $content}) ' +
      'WITH p ' +
      'MATCH (u:User {id: $userId}) ' +
      'CREATE (u)-[:AUTHORED]->(p) ' +
      'RETURN p',
      { title, content, userId }
    );
    return result.records[0].get('p').properties;
  } finally {
    await session.close();
  }
};

module.exports = {
  getPostById,
  getPostsByUser,
  createPost,
};