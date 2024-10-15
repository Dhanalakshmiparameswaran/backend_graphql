import { buildSchema } from "graphql";

export const studentSchema = buildSchema(`
  type Query {
    students: [Student] 
    user(email: String!): User
  }

  type Student {
    id: ID!
    roll_no: String!
    name: String!
    classSection: String!
    mark: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    token: String!
  }

  enum UserRole {
    STUDENT
    TEACHER
  }

  type Mutation {
    addNewRow(roll_no: String!, name: String!, classSection: String!, mark: String!): Student
    updateRow(id: ID!, roll_no: String, name: String, classSection: String, mark: String): Student
    deleteRow(id: ID!): DeletionResponse
    signup(name: String!, email: String!, password: String!, role: UserRole!): User
    signIn(email: String!, password: String!): User
  }

  type DeletionResponse {
    message: String
  }
`);
