import { buildSchema } from "graphql";

export const studentSchema = buildSchema(`
  type Query {
    students: [StudentList]
    user(email: String!): User
  }

  type StudentList {
    id: ID!
    roll_no: String!
    name: String!
    classSection: String!
    mark: String!
  }

  type User {
    id: ID!
    email: String!
    role: UserRole!
  }

  enum UserRole {
    STUDENT
    TEACHER
  }

  type Mutation {
    addNewRow(roll_no: String!, name: String!, classSection: String!, mark: String!): StudentList
    updateRow(id: ID!, roll_no: String, name: String, classSection: String, mark: String): StudentList
    deleteRow(id: ID!): DeletionResponse
    signup(email: String!, password: String!, role: UserRole!): User
    login(email: String!, password: String!): User
  }

  type DeletionResponse {
    message: String
  }
`);
