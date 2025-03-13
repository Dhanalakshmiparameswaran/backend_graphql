# Student Management API
This project provides a GraphQL API for managing a student list and user authentication. It allows users to sign up and sign in, and performs CRUD operations on the student list table.

## Features
- User Authentication: Sign up and sign in functionality for users.
- CRUD Operations: Create, Read, Update, and Delete student records.
- GraphQL Interface: Efficient data querying and manipulation.

## Technologies Used
- **Node.js**: JavaScript runtime for building the server.
- **TypeScript**: Adds type safety to JavaScript for better code quality.
- **Express**: Web framework for building the API.
- **Apollo Server**: Framework for creating a GraphQL server.
- **PostgreSQL**: Relational database for storing user and student data.


### Prerequisites
- Node.js
- npm 
- PostgreSQL database

### Installation
1. Clone the repository:
   git clone https://github.com/Dhanalakshmiparameswaran/backend_graphql.git

   cd backend_graphql

2. Install dependencies:

     ## npm install

        Set up environment variables: Create a .env file in the root directory and add the following:

     ## env

        PORT=Your_Port_Number
        DB_NAME=Your_DB_Name
        DB_USER=Your_DB_UserName
        DB_PASS=Your_DB_Password
        DB_HOST=Your_DB_Host_Number
        DB_PORT=Your_DB_Port_Number
        JWT_SECRET=Your_Secret_Key


3. Start the server:

   ### `npm start`

4. GraphQL Endpoints

    /graphql: Access the GraphQL playground for testing queries and mutations.

## Example Queries and Mutations

***Get all students:***


query {
  students {
    id
    roll_no
    name
    classSection
    mark
  }
}

***Create a new student:***


mutation {
  signIn(input: { email: "aaaa@example.com", password: "xxxxx" }) {
    email
    password
  }
}

***User Registration:***
    signup(name: String!, email: String!, password: String!, role: UserRole!): User

    mutation {
      signup(input: { name: "Aaaaa", email: "aaaa@example.com", password: "xxxxx" , role: "Student" }) {
        name
        email
        password
        role
      }
    }

## Testing

To run tests, use:

### `npm test`
