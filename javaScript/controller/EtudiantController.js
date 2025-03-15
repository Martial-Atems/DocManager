import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';
// import JsonWebToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route pour l'insertion d'un étudiant
router.post('/', (req, res) => {
    try {
        const { etudiant, filiere, niveau } = req.body; 

        // Validation des données reçues
        if (!etudiant || !filiere || !niveau) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const newEtudiant = {
            id_utilisateur: etudiant,
            id_filiere: filiere,
            niv: niveau
        };

        // Requête SQL avec syntaxe corrigée
        const query = 'INSERT INTO etudiants (id_utilisateur, id_filiere, niveau) VALUES (?, ?, ?)';

        connection.query(query, [newEtudiant.id_utilisateur, newEtudiant.id_filiere, newEtudiant.niv], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de l\'étudiant :', err);

                // Gestion plus fine des erreurs SQL
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: "L'étudiant existe déjà" });
                }

                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }

            res.status(201).json({ message: "Étudiant créé avec succès", data: results.insertId });
        });

    } catch (error) {
        console.error('Erreur inattendue:', error);
        res.status(500).json({ message: "Erreur du serveur" });
    }
});

export default router;