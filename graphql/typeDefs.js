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
    villages(
      limit: Int!
      skip: Int
      options: Object
    ): [Village]
    search(
      keyword: String
    ): [Village]
  }
`;

module.exports = typeDefs;