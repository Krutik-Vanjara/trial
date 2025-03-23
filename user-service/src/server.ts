import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./database";
import authRoutes from "./routes/auth";
import { createDefaultUser } from "./models/User";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à PostgreSQL réussie !");
    
    await sequelize.sync({ alter: true });
    console.log("Base de données synchronisée avec succès !");
    
    await createDefaultUser();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  } catch (error) {
    console.error("Erreur de connexion ou de synchronisation à PostgreSQL :", error);
  }
};

startServer();
