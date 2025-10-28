import express from "express";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "5001", 10);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    service: "JANI AI Service",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    note: "Placeholder service - AI integration pending"
  });
});

app.listen(port, () => {
  console.log(`AI service listening on ${port}`);
});
