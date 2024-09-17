const { getUserById, getAllUsers, createUser } = require('../models/postgresModel');
const { getPostById, getPostsByUser, createPost } = require('../models/neo4jModel');

const resolvers = {
  Query: {
    user: (_, { id }) => getUserById(id),
    users: () => getAllUsers(),
    post: (_, { id }) => getPostById(id),
  },
  Mutation: {
    addUser: (_, { name, email }) => createUser(name, email),
    addPost: (_, { title, content, userId }) => createPost(title, content, userId),
  },
  User: {
    posts: (parent) => getPostsByUser(parent.id),
  },
  Post: {
    user: (parent) => getUserById(parent.userId),
  },
};

module.exports = resolvers;