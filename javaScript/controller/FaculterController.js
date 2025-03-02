import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';

const router = express.Router();

// Route pour ajouter/enregistrer une nouvelle faculter.
router.post('/', (req, res) => {
    const{id, nomFac} = req.body;
    const fac = {
        id_faculter: id,
        nom_faculter: nomFac
    };
    connection.query('INSERT INTO faculter (nomFac) VALUE (?)',[fac.nom_faculter], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion de la faculter :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur'});
        }
        res.status(201).json({ message: 'Faculter créé avec succès'});
    });
});

//Route pour recuperer les Faculters ds la Bdd
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM faculter';
    connection.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

//Route pour modifier une faculter
router.patch('/:facId', (req, res) => {
    const facId = parseInt(req.params.facId);
    const {nomFac} = req.body;

    // Requette sql pour la mise a jour
    const sql = `UPDATE faculter SET nomFac = ? WHERE id_faculter = ?`;

    // Execution de la requette sql
    connection.query(sql, [nomFac, facId], (err, result) => {
        if(result) {
            res.status(200).json({ message: 'Faculter mis à jour avec succès' });
        } 
        if (err) {
            console.log('erreur');
        }
    });
});

//Route pour supprimer une faculter
router.delete('/:facId', (req, res) => {
    const facId = parseInt(req.params.facId);
   
    const query = 'DELETE FROM faculter WHERE id_faculter = ?';
    connection.query(query, [facId], (err, result) => {
        if (result) {
            res.status(200).json({ message: 'Faculter supprimer avec succès' }); 
        }
        if (err) {
            console.log('erreur');
        }
   });
});

export default router;