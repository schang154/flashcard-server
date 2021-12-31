import Express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import postRoutes from "./routes/cards.js";
import userRoutes from "./routes/users.js";

const app = Express();
dotenv.config();

app.use(Express.json({ limit: "1mb", extended: true }));
app.use(Express.urlencoded({ limit: "1mb", extended: true }));
app.use(cors());

app.use("/api/v1/cards", postRoutes);
app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  res.send(`Welcome to Flashcard API`);
})

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
  )
  .catch((error) => console.log(error.message));
