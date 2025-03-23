import { Pool, Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "postgres",
});

// Vérifie et crée la BDD si elle n'existe pas
const createDatabase = async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'taskdb'");
    if (res.rowCount === 0) {
      await client.query("CREATE DATABASE taskdb");
      console.log("Base de données 'taskdb' créée !");
    } else {
      console.log("Base de données 'taskdb' déjà existante.");
    }
  } catch (error) {
    console.error("Erreur lors de la création de la BDD :", error);
  } finally {
    await client.end();
  }
};

(async () => {
  await createDatabase();
})();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "taskdb", 
});

export default pool;