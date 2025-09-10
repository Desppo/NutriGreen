import express from "express";
import dotenv from "dotenv";
import dietRoutes from "./routes/diet.js";

dotenv.config({ path: "key.env" });

const app = express();
const PORT = 3000;

// Archivos públicos
app.use(express.static("public"));

// Rutas
app.use("/diet", dietRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
