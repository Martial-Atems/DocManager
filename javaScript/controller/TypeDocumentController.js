import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';

const router = express.Router();

// Route pour ajouter/enregistrer un nouveau type de documents.
router.post('/', (req, res) => {
    const{id, nomTypeDoc} = req.body;
    const typeDoc = {
        id_typedoc: id,
        nom_typedoc: nomTypeDoc
    };
    connection.query('INSERT INTO type_document (libelle_type_doc) VALUE (?)',[typeDoc.nom_typedoc], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion du role :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur'});
        }
        res.status(201).json({ message: 'Type de document créé avec succès'});
    });
});

// Route pour recuperer les type de document ds la Bdd
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM type_document';
    connection.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

//Route pour modifier un type de document
router.patch('/:typedocId', (req, res) => {
    const typedocId = parseInt(req.params.typedocId);
    const {libelle} = req.body;    

    // Requette sql pour la mise a jour
    const sql = `UPDATE type_document SET libelle_type_doc = ? WHERE id_type_doc = ?`;

    // Execution de la requette sql
    connection.query(sql, [libelle, typedocId], (err, result) => {
        if(result) {
            res.status(200).json({ message: 'Type de document mis à jour avec succès' });
        } 
        if (err) {
            console.log('erreur');
        }
    });
});

//Route pour supprimer un type de document
router.delete('/:typedocId', (req, res) => {
    const typedocId = parseInt(req.params.typedocId);
   
    const query = 'DELETE FROM type_document WHERE id_type_doc = ?';
    connection.query(query, [typedocId], (err, result) => {
        if (result) {
            res.status(200).json({ message: 'Type de document supprimer avec succès' }); 
        }
        if (err) {
            console.log('erreur');
        }
   });
});

export default router;