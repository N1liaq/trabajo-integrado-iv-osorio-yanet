import express from "express";
import sequelize from "./src/config/database.js";
import movieRoutes from "./src/routes/movie.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

// Rutas
app.use("/api/movies", movieRoutes);

// Sincronizar base de datos e iniciar servidor
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error);
  });
