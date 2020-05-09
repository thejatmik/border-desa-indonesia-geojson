const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Object
  scalar Array

  type Village {
    _id: String
    province: String
    district: String
    sub_district: String
    village: String
    border: Object
  }

  type Query {
    hello: String
    village: Village
  }
`;

module.exports = typeDefs;