import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Auth service running on port ${PORT}`);
});
