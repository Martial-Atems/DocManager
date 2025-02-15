import express from 'express';
import cors from 'cors';

// Controller
import RolesController from './javaScript/controller/RolesController.js'; 

const app = express();

// Middleware pour parser JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Ajoute le CORS pour éviter les erreurs de requêtes Cross-Origin

// Route test
app.get('/', (req, res) => {
    res.send("Hello, il s'agit de Node.js!");
});

// Routes API
app.use('/roles', RolesController);

// Démarrage du serveur avec gestion des erreurs
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur en écoute sur http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error("❌ Erreur lors du démarrage du serveur :", err);
});
