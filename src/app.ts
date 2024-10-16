import express from "express";
import { AppDataSource } from "./database";
import { graphqlHTTP } from "express-graphql";
import { studentSchema } from "./studentSchema";
import { studentRootValue } from "./studentRootValue";
import cors from "cors";

const app = express();
app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema: studentSchema,
    rootValue: studentRootValue,
    graphiql: true,
  })
);
app.listen(process.env.PORT || 4500, async () => {
  console.log(`successfully connected port ${process.env.PORT}`);
  try {
    await AppDataSource.initialize();
    if (AppDataSource.isInitialized) {
      console.log("DB connected succesfully");
    }
  } catch (error) {
    console.error("DB connection error:", error);
  }
});
