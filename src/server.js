import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.js";
const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/auth", authRoutes);

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.error("Failed to start:", err.message);
    process.exit(1);
  }
  console.log("Running on", process.env.PORT);
});
