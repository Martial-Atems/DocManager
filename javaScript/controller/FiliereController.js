import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';

const router = express.Router();

// Route pour ajouter/enregistrer une nouvelle filiere.
router.post('/', (req, res) => {
    const{faculter, nomFil} = req.body;
    const fil = {
        id_faculter: faculter,
        nomFiliere: nomFil
    };

    connection.query('INSERT INTO filiere (id_faculter, nomFiliere) VALUE (?, ?)',[fil.id_faculter, fil.nomFiliere], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion de la filiere :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur'});
        }
        res.status(201).json({ message: 'Filière créé avec succès'});
    });
});

// Route pour recuperer les Filieres ds la Bdd.
router.get('/', (req, res) => {
    const sql = 'SELECT fil.*, fac.* FROM filiere fil left join faculter fac on fac.id_faculter = fil.id_faculter;';
    connection.query(sql, (err, results) => {
      if(err) throw err;
      res.send(results);
    });
});

//Route pour modifier une filiere
router.patch('/:filId', (req, res) => {
    const filId = parseInt(req.params.filId);
    const {nom_filiere} = req.body;

    // Requette sql pour la mise a jour
    const sql = `UPDATE filiere SET nomFiliere = ? WHERE id_filiere = ?`;

    // Execution de la requette sql
    connection.query(sql, [nom_filiere, filId], (err, result) => {
        if(result) {
            res.status(200).json({ message: 'Filiere mis à jour avec succès' });
        } 
        if (err) {
            console.log('erreur');
        }
    });
});

//Route pour supprimer une filiere
router.delete('/:filId', (req, res) => {
    const filId = parseInt(req.params.filId);
   
    const query = 'DELETE FROM filiere WHERE id_filiere = ?';
    connection.query(query, [filId], (err, result) => {
        if (result) {
            res.status(200).json({ message: 'Filière supprimer avec succès' }); 
        }
        if (err) {
            console.log('erreur');
        }
   });
});

export default router;