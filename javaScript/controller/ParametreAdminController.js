import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';
// import JsonWebToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route pour le changement de mot de passe
router.post('/', async (req, res) => {
    const { email, password, newPassword } = req.body;

    if (!email || !password || !newPassword) {
        return res.status(400).json({ message: `L'email, le mot de passe actuel, et le nouveau mot de passe sont requis` });
    }

    try {
        // Vérifier si l'utilisateur existe et récupérer son rôle
        const querySelect = 'SELECT id_role, passWord FROM utilisateur WHERE email = ?';
        connection.query(querySelect, [email], async (err, results) => {
            if (err) {
                console.error('Erreur lors de la récupération des données:', err);
                return res.status(500).json({ message: 'Erreur serveur', error: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }

            const user = results[0];

            // Vérifier si l'utilisateur a le rôle "id_role == 2"
            if (user.id_role !== 1) {
                return res.status(403).json({ message: "Vous n'êtes pas autorisé à changer votre mot de passe" });
            }

            // Comparer le mot de passe fourni avec celui stocké dans la base de données
            const passwordMatch = await bcrypt.compare(password, user.passWord);
            if (!passwordMatch) {
                return res.status(401).json({ message: 'Le mot de passe actuel est incorrect' });
            }

            // Hacher le nouveau mot de passe
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // Mettre à jour le mot de passe
            const queryUpdate = 'UPDATE utilisateur SET passWord = ? WHERE email = ?';
            connection.query(queryUpdate, [hashedNewPassword, email], (err, result) => {
                if (err) {
                    console.error('Erreur lors de la mise à jour du mot de passe:', err);
                    return res.status(500).json({ message: 'Erreur serveur', error: err });
                }

                res.status(200).json({ message: 'Mot de passe changé avec succès' });
            });
        });
    } catch (error) {
        console.error('Erreur interne du serveur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur', error });
    }
});

export default router;