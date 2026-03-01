import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config(); 

import marketRoutes from "./routes/market.routes.js";
import newsRoutes from "./routes/news.routes.js";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://current-news-omega.vercel.app"
  ],
}));
app.use(express.json()); 

app.use("/api/markets", marketRoutes); 
app.use("/api/news", newsRoutes); 

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 