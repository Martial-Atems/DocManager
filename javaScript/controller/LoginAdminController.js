import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';
// import JsonWebToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route pour l'authentification d'un Admin
router.post('/', (req, res) => {
    const { adresse_mail, mot_de_passe } = req.body;

    // Validation des champs
    if (!adresse_mail || !mot_de_passe) {
        return res.status(400).json({ message: "L'adresse mail et le mot de passe sont requis" });
    }

    // Force l'email en minuscule
    const email = adresse_mail.toLowerCase();

    // Requête SQL pour vérifier l'email
    const query = `SELECT u.* FROM utilisateur u WHERE LOWER(u.email) = ?;`;

    connection.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Erreur SQL:", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }

        // verification de l'utilisateur
        if (results.length === 0) {
            return res.json({ error: "email" });
        }

        // Récupération de l'utilisateur
        const user = results[0];

        // verification du mots de passe dans la bd
        if (!user.passWord) {
            return res.status(500).json({ error: "Mot de passe manquant dans la base" });
        }

        try {
            // Vérification du mot de passe (assure-toi que le champ est bien 'password')
            const passwordMatch = await bcrypt.compare(mot_de_passe, user.passWord);

            if (!passwordMatch) {
                return res.json({ error: "password" });
            }

            // Si l'utilisateur est un admin, rediriger vers son espace
            const redirectUrl = '/html/administrateur/dashboard.html';

            // Envoi de l'ID utilisateur et de l'URL de redirection
            res.json({ 
                redirectUrl,
                userId: user.id_utilisateur
            });
        } catch (compareErr) {
            console.error("Erreur de comparaison bcrypt:", compareErr);
            return res.status(500).json({ error: "Erreur lors de la vérification du mot de passe" });
        }
    });
});

export default router;