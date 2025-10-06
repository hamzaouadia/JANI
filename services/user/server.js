import express from "express";

const app = express();
const port = Number.parseInt(process.env.PORT ?? "5000", 10);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`User service listening on ${port}`);
});
