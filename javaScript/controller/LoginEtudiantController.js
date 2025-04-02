import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';
// import JsonWebToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route pour l'authentification d'un étudiant
router.post('/', (req, res) => {
    const { adresse_mail, mot_de_passe } = req.body;

    // Validation des champs
    if (!adresse_mail || !mot_de_passe) {
        return res.status(400).json({ message: "L'adresse mail et le mot de passe sont requis" });
    }

    // Requête SQL pour vérifier l'utilisateur par email
    const query = 'SELECT * FROM etudiants e INNER JOIN utilisateur u ON e.id_utilisateur = u.id_utilisateur WHERE email = ?;';
    connection.query(query, [adresse_mail], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur serveur' });
        }

        // Vérification de l'utilisateur
        if (results.length === 0) {
            return res.json({ success: false, error: 'email' });
        }

        // Récupération de l'utilisateur et comparaison du mot de passe
        const user = results[0];
        const passwordMatch = await bcrypt.compare(mot_de_passe, user.passWord);

        if (!passwordMatch) {
            return res.json({ success: false, error: 'password' });
        }

        // Définition de l'URL de redirection
        let redirectUrl = "";
        if (user.id_role === 2) {
            redirectUrl = '/html/etudiant/accueilEtudiant.html';
        }

        // Envoi de la réponse avec succès
        res.json({ 
            success: true,
            redirectUrl,
            userId: user.id_utilisateur  
        });
    });
});

export default router;