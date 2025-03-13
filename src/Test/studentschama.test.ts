import supertest from 'supertest';
import { studentRootValue } from '../studentRootValue'
import { app } from '../app';

jest.mock('../studentRootValue', () => ({
  studentRootValue: {
    signIn: jest.fn(),
    signup: jest.fn(),
    addNewRow: jest.fn(),
    updateRow: jest.fn(),
    deleteRow: jest.fn(),
  }
}));

describe("GraphQL Resolvers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign in a user", async () => {
    (studentRootValue.signIn as jest.Mock).mockResolvedValueOnce({
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      role: "STUDENT",
      token: "someSignedJWTToken",
    });

    const mutation = `
      mutation signIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
          id
          name
          email
          role
          token
        }
      }
    `;
    const variables = { email: "jane@example.com", password: "password123" };

    const response = await supertest(app)
      .post('/graphql')
      .send({ query: mutation, variables });

    expect(response.status).toBe(200);
    expect(response.body.data.signIn.name).toBe("Jane Doe");
    expect(response.body.data.signIn.token).toBe("someSignedJWTToken");
  });

  it("should sign up a new user", async () => {
    (studentRootValue.signup as jest.Mock).mockResolvedValueOnce({
      id: "2",
      name: "John Doe",
      email: "john@example.com",
      role: "STUDENT",
      token: "someSignedJWTToken",
    });

    const mutation = `
      mutation signup($name: String!, $email: String!, $password: String!, $role: UserRole!) {
        signup(name: $name, email: $email, password: $password, role: $role) {
          id
          name
          email
          role
          token
        }
      }
    `;
    const variables = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "STUDENT"
    };

    const response = await supertest(app)
      .post('/graphql')
      .send({ query: mutation, variables });

    expect(response.status).toBe(200);
    expect(response.body.data.signup.name).toBe("John Doe");
    expect(response.body.data.signup.token).toBe("someSignedJWTToken");
  });

  it("should add a new row", async () => {
    (studentRootValue.addNewRow as jest.Mock).mockResolvedValueOnce({
      id: "3",
      roll_no: "A103",
      name: "Alice",
      classSection: "A2",
      mark: "88"
    });

    const mutation = `
      mutation addNewRow($roll_no: String!, $name: String!, $classSection: String!, $mark: String!) {
        addNewRow(roll_no: $roll_no, name: $name, classSection: $classSection, mark: $mark) {
          id
          roll_no
          name
          classSection
          mark
        }
      }
    `;
    const variables = { roll_no: "A103", name: "Alice", classSection: "A2", mark: "88" };

    const response = await supertest(app)
      .post('/graphql')
      .send({ query: mutation, variables });

    expect(response.status).toBe(200);
    expect(response.body.data.addNewRow.name).toBe("Alice");
    expect(response.body.data.addNewRow.roll_no).toBe("A103");
  });

  it("should delete a row", async () => {
    (studentRootValue.deleteRow as jest.Mock).mockResolvedValueOnce({ message: "Row with ID 1 deleted" });

    const mutation = `
      mutation deleteRow($id: ID!) {
        deleteRow(id: $id) {
          message
        }
      }
    `;
    const variables = { id: "1" };

    const response = await supertest(app)
      .post('/graphql')
      .send({ query: mutation, variables });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteRow.message).toBe("Row with ID 1 deleted");
  });
});
