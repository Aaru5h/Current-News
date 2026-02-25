import express from "express";
import cors from "cors";
import dontenv from "dontenv";
import marketRoutes from ",/routes/market.routes.js";

dontenv.config(); 

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/market.routes.js", marketRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Sever running on port ${PORT}');
}); 
