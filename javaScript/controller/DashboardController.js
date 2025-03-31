import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';

const router = express.Router();

// Route pour obtenir le nombre total d'utilisateurs
router.get('/count-users', (req, res) => {
    const sql = 'SELECT COUNT(*) AS totalUsers FROM utilisateur;';
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Route pour obtenir le nombre d'étudiants
router.get('/count-students', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS totalEtudiant
            FROM etudiants e
            left JOIN utilisateur u ON e.id_utilisateur = u.id_utilisateur
            WHERE u.id_role = 2
        ;
    `;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Route pour obtenir le nombre de document
router.get('/count-documents', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS totalDocuments
            FROM document
        ;
    `;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Route pour obtenir le nombre de faculter
router.get('/count-faculter', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS totalFaculter
            FROM faculter
        ;
    `;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Route pour obtenir le nombre de filiere
router.get('/count-filiere', (req, res) => {
    const sql = `
        SELECT COUNT(*) AS totalFiliere
            FROM filiere
        ;
    `;
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

export default router;