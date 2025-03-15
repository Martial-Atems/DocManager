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
        connection.query('INSERT INTO utilisateur (id_role, nom, prenom, dateNais, lieuNais, sexe, adresse, numeroTel, email, passWord) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
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

// Route pour recuperer les users dans la Bdd.
router.get('/', (req, res) => {
    const sql = 'SELECT u.*, r.* FROM utilisateur u left join roles r on r.id_role = u.id_role;';
    connection.query(sql, (err, results) => {
      if(err) throw err;
      res.send(results);
    });
});
  
// Route pour mettre à jour un utilisateur par ID avec la méthode PATCH
router.patch('/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);

    const { nom_user, prenom_user, date_nais, lieu_nais, sexe, adresse, numero_tel } = req.body;

    if (!nom_user || !prenom_user || !date_nais || !lieu_nais || !sexe || !adresse || !numero_tel) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const sql = `
        UPDATE utilisateur 
        SET nom = ?, prenom = ?, dateNais = ?, lieuNais = ?, sexe = ?, adresse = ?, numeroTel = ?
        WHERE id_utilisateur = ?
    `;

    connection.query(sql, [nom_user, prenom_user, date_nais, lieu_nais, sexe, adresse, numero_tel, userId], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
    });
});

//Route pour supprimer un utilisateur
router.delete('/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const query = 'DELETE FROM utilisateur WHERE id_utilisateur = ?';
    connection.query(query, [userId], (err, result) => {
        if (result) {
            res.status(200).json({ message: 'Utilisateur supprimer avec succès' }); 
        }
        if (err) {
            console.log('erreur');
        }
    });
});

export default router;