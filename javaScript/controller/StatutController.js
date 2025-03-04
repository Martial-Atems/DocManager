import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';

const router = express.Router();

router.get('/', (req, res) => {
    const sql = 'SELECT id_ses, statut FROM session';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des sessions:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des sessions' });
        }
        res.json(results);
    });
});


// Route PATCH pour mettre à jour (activer ou desactiver) le statut de la session
router.patch('/:sesId', (req, res) => {
    const sesId = req.params.sesId;
    const { statut } = req.body;

    // Vérifier si l'utilisateur essaie d'activer une session
    if (statut === 'Activer') {
        const checkActiveSessionSql = 'SELECT * FROM session WHERE statut = "Activer" AND id_ses != ?';

        connection.query(checkActiveSessionSql, [sesId], (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification des sessions actives:', err);
                return res.status(500).json({ error: 'Erreur lors de la vérification des sessions actives' });
            }

            if (results.length > 0) {
                // Il y a déjà une autre session active
                return res.status(400).json({ error: 'Une session est déjà active. Désactivez-la avant d\'activer une nouvelle session.' });
            }

            // Si aucune autre session n'est active, procéder à la mise à jour
            updateSessionStatus(sesId, statut, res);
        });
    } else {
        // Si on ne cherche pas à activer la session, procéder à la mise à jour directement
        updateSessionStatus(sesId, statut, res);
    }
});

function updateSessionStatus(sesId, statut, res) {
    const sql = 'UPDATE session SET statut = ? WHERE id_ses = ?';
    connection.query(sql, [statut, sesId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de la session:', err);
            return res.status(500).json({ error: 'Erreur lors de la mise à jour de la session' });
        }
        res.json({ message: 'Statut de la session mis à jour avec succès' });
    });
}

export default router;