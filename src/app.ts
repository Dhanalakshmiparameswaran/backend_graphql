import express from "express";
import { AppDataSource } from "./database";

const app = express();

app.listen(process.env.PORT, async () => {
  console.log(`successfully connected port ${process.env.PORT}`);
  try {
    await AppDataSource.initialize();
    if (AppDataSource.isInitialized) {
      console.log("DB connected succesfully");
    }
  } catch {
    console.log("DB connection error");
  }
});
