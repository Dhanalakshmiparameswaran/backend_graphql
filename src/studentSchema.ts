import { buildSchema } from "graphql";

export const studentSchema = buildSchema(`
  type Query {
    students: [StudentList]
  }

  type StudentList {
    id: ID!
    roll_no: String!
    name: String!
    classSection: String!
    mark: String!
  }

  type Mutation {
    addNewRow(roll_no: String!, name: String!, classSection: String!, mark: String!): StudentList
    updateRow(id: ID!, roll_no: String, name: String, classSection: String, mark: String): StudentList
    deleteRow(id: ID!): DeletionResponse
  }

  type DeletionResponse {
    message: String
  }
`);
