import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';
// import JsonWebToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Route pour enregistrer un nouvel utilisateur
router.post('/', async (req, res) => {
    const { id, role, nom, prenom, datenais, lieunais, sexe, adresse, phone, email, password } = req.body;
    const user = {
        id_users: id, 
        id_role: role, 
        nom_user: nom, 
        prenom_user: prenom, 
        date_nais: datenais, 
        lieu_nais: lieunais, 
        sexe: sexe, 
        adresse: adresse, 
        numero_tel: phone, 
        adresse_mail: email, 
        mot_de_passe: password
    };
    try {
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(user.mot_de_passe, 10);

        // Insertion des données de l'utilisateur dans la base de données
        connection.query('INSERT INTO users (id_role, nom_user, prenom_user, date_nais, lieu_nais, sexe, adresse, numero_tel, adresse_mail, mot_de_passe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [user.id_role, user.nom_user, user.prenom_user, user.date_nais, user.lieu_nais, user.sexe, user.adresse, user.numero_tel, user.adresse_mail, hashedPassword], 
        (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion de l\'utilisateur :', err);
                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }
            res.status(201).json({ message: 'Utilisateur créé avec succès' });
        });
    } catch (err) {
        console.error('Erreur lors du hachage du mot de passe :', err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

export default router;