import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';
// import JsonWebToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route pour l'insertion d'un administrateur
router.post('/', (req, res) => {
    try {
        const { administrateur } = req.body; // Aligné avec le frontend

        // Validation des données reçues
        if (!administrateur) {
            return res.status(400).json({ message: "Le champ administrateur est requis" });
        }

        const newAdmin = {
            id_utilisateur: administrateur
        };

        // Requête SQL avec une gestion des erreurs améliorée
        const query = 'INSERT INTO administrateur (id_utilisateur) VALUES (?)';

        connection.query(query, [newAdmin.id_utilisateur], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de l\'administrateur :', err);

                // Gestion plus fine des erreurs SQL
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: "Cet administrateur existe déjà" });
                }

                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }

            res.status(201).json({
                message: "Administrateur créé avec succès",
                data: { id: results.insertId, id_utilisateur: administrateur }
            });
        });

    } catch (error) {
        console.error('Erreur inattendue:', error);
        res.status(500).json({ message: "Erreur du serveur" });
    }
});

export default router;