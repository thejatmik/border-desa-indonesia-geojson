const express = require('express');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');

const mongoVillage = require('./db/village_mongodb');

const collection = 'Village';
const meta = 'Meta'; // {lastUpdated: Date()}

const app =  express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


mongoVillage.connectToServer()
  .then(() => {
    const typeDefs = require('./graphql/typeDefs');
    const resolvers = require('./graphql/resolvers');

    const graphql = new ApolloServer({ typeDefs, resolvers });
    
    graphql.applyMiddleware({ app, path: '/graphql' });

    // app here
    app.listen({ port: 3000 }, () => {
      console.log('Server at 3000')
    })
  })
  .catch(err => {
    console.log(err.message);
  });