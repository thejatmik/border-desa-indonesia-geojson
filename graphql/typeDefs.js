const { gql } = require('apollo-server-express');

const typeDefs = gql`
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
    subdistrict(
      keyword: String!
    ): Object
    provinceList: ProvinceList
    districtList(
      province: String!
    ): DistrictList
    subdistrictList(
      province: String!
      district: String!
    ): SubdistrictList
    villageList(
      province: String!
      district: String!
      sub_district: String!
    ): VillageList
    villageBorder(
      province: String!
      district: String!
      sub_district: String!
      village: String!
    ): Village
    subdistrictBorder(
      province: String!
      district: String!
      sub_district: String!
    ): Subdistrict
  }

  scalar Object
  scalar Array

  type Village {
    province: String
    district: String
    sub_district: String
    village: String
    border: Object
  }

  type Subdistrict {
    province: String
    district: String
    sub_district: String
    border: Object
  }

  type District {
    province: String
    district: String
    border: Object
  }

  type Province {
    province: String
    border: Object
  }

  type ProvinceList {
    provinces: Array
  }

  type DistrictList {
    province: String
    districts: Array
  }

  type SubdistrictList {
    province: String
    district: String
    subdistricts: Array
  }

  type VillageList {
    province: String
    district: String
    sub_district: String
    villages: Array
  }
`;

module.exports = typeDefs;