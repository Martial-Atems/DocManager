import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';

const router = express.Router();

// Route pour ajouter/enregistrer un nouveau role.
router.post('/', (req, res) => {
    const{nomRole} = req.body;

    // Objet rol
    const rol = {
        nom_role: nomRole
    };
    
    connection.query('INSERT INTO roles (nomRole) VALUE (?)',[rol.nom_role], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion du role :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur'});
        }
        res.status(201).json({ message: 'Role créé avec succès'});
    });
});

// Route pour recuperer les Roles ds la Bdd
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM roles';
    connection.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

// Route pour modifier un role
router.patch('/:roleId', (req, res) => {
    const roleId = parseInt(req.params.roleId);
    const {nom_role} = req.body;

    // Requette sql pour la mise a jour
    const sql = `UPDATE roles SET nomRole = ? WHERE id_role = ?`;

    // Execution de la requette sql
    connection.query(sql, [nom_role, roleId], (err, result) => {
        if(result) {
            res.status(200).json({ message: 'Role mis à jour avec succès' });
        } 
        if (err) {
            console.log('erreur');
        }
    });
});

// Route pour supprimer un Role
router.delete('/:roleId', (req, res) => {
    const roleId = parseInt(req.params.roleId);
   
    const query = 'DELETE FROM roles WHERE id_role = ?';
    connection.query(query, [roleId], (err, result) => {
        if (result) {
            res.status(200).json({ message: 'Role supprimer avec succès' }); 
        }
        if (err) {
            console.log('erreur');
        }
   });
});

export default router;