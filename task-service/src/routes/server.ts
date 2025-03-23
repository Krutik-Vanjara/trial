import express from "express";
import { Request, Response } from "express";
import pool from "../config/db";
import cors from "cors";  // Importer cors

const app = express();
const PORT = 3000;
const router = express.Router(); // Utiliser express.Router() explicitement

app.use(cors()); 

app.use(express.json());

async function startServer() {
  try {
      await pool.query("SELECT 1"); // Vérification simple de la connexion
      console.log("Connexion à PostgreSQL réussie !");
      
      // Créer la table des tâches si elle n'existe pas
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status VARCHAR(50) DEFAULT 'pending',
          user_id INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("Table 'tasks' prête !");

      // Utiliser le routeur
      app.use(router);

      app.listen(PORT, () => {
          console.log(`Serveur démarré sur http://localhost:${PORT}`);
      });

  } catch (error) {
      console.error("Erreur de connexion à PostgreSQL :", error);
      process.exit(1); // Quitter le processus si la BDD ne fonctionne pas
  }
}

// Route racine
router.get("/", (req: Request, res: Response) => {
  res.send("Task Manager API - Utilisez /tasks pour gérer vos tâches");
});

// Récupérer toutes les tâches d'un utilisateur
router.get("/tasks", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis" });
    }
    
    const { rows } = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    
    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer une tâche spécifique
router.get("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis" });
    }
    
    const { rows } = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération de la tâche :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Créer une nouvelle tâche
router.post("/tasks", async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;
    
    if (!title || !userId) {
      return res.status(400).json({ message: "Titre et ID utilisateur requis" });
    }
    
    const { rows } = await pool.query(
      "INSERT INTO tasks (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description || "", userId]
    );
    
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la création de la tâche :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour une tâche
router.put("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis" });
    }
    
    // Vérifier si la tâche existe et appartient à l'utilisateur
    const checkResult = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    
    const { rows } = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 AND user_id = $5 RETURNING *",
      [title, description, status, id, userId]
    );
    
    res.json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la tâche :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer une tâche
router.delete("/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "ID utilisateur requis" });
    }
    
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

startServer();