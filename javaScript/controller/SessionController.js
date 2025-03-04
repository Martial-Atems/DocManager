import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';

const router = express.Router();

// Route pour ajouter/enregistrer une nouvelle session.
router.post('/', (req, res) => {
    const{debutSes, finSes, libSes} = req.body;
    const statut = 'Désactiver';
    const ses = {
        date_Debut: debutSes,
        date_Fin: finSes,
        libelle_Session: libSes
    };
    connection.query('INSERT INTO session (dateDebut, dateFin, libelleSes, statut) VALUE (?, ?, ?, ?)',
        [ses.date_Debut, ses.date_Fin, ses.libelle_Session, statut], (err, results) => {

        if (err) {
            console.error('Erreur lors de l\'insertion de la session :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur'});
        }
        res.status(201).json({ message: 'Session créé avec succès'});
    });
});

//Route pour recuperer les Sessions ds la Bdd
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM session';
    connection.query(sql, (err, results) => {
        if(err) throw err;
        res.send(results);
    });
});

//Route pour modifier une session
router.patch('/:sesId', (req, res) => {
    const sesId = parseInt(req.params.sesId);
    const {date_Debut, date_Fin, libelle_Session} = req.body;
    // Requette sql pour la mise a jour
    const sql = `
        UPDATE session 
        SET 
            dateDebut = ?, 
            dateFin = ?, 
            libelleSes = ?
        WHERE id_ses = ?
    `;

    // Execution de la requette sql
    connection.query(sql, [date_Debut, date_Fin, libelle_Session, sesId], (err, result) => {
        if(result) {
            res.status(200).json({ message: 'Session mis à jour avec succès' });
        } 
        if (err) {
            console.log('erreur');
        }
    });
});

//Route pour supprimer une Session
router.delete('/:sesId', (req, res) => {
    const sesId = parseInt(req.params.sesId);
   
    const query = 'DELETE FROM session WHERE id_ses = ?';
    connection.query(query, [sesId], (err, result) => {
        if (result) {
            res.status(200).json({ message: 'Session supprimer avec succès' }); 
        }
        if (err) {
            console.log('erreur');
        }
   });
});

export default router;