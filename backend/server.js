import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // Use `import` instead of `require`

const app = express();
app.use(cors());
app.use(express.json());

app.get("/quiz", async (req, res) => {
  try {
    const response = await fetch("https://api.jsonserve.com/Uw5CrX");
    if (!response.ok) throw new Error("Failed to fetch quiz data");

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
