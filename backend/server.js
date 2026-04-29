import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import itemRoutes from "./routes/itemRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Item Manager API is running..." });
});

app.use("/api/items", itemRoutes);

const PORT = process.env.PORT || 5000;
const MAX_DB_CONNECT_ATTEMPTS = 10;

const connectToDatabase = async () => {
  for (let attempt = 1; attempt <= MAX_DB_CONNECT_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
      return;
    } catch (error) {
      console.error(
        `Database connection attempt ${attempt} failed:`,
        error.message
      );

      if (attempt === MAX_DB_CONNECT_ATTEMPTS) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
