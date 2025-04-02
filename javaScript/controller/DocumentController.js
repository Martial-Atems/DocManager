import express from 'express';
import connection from '../../config/connection.js';
import storage from '../../config/fileNames.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

// Définir __dirname pour ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ storage: storage });

// ➤ Route pour ajouter un document
router.post('/', upload.single('nomdoc'), (req, res) => {
    const { userId, id_typedoc, libelledoc } = req.body;
    const nomdoc = req.file ? req.file.originalname : null; // Utilisation du nom original

    if (!userId || !id_typedoc || !libelledoc || !nomdoc) {
        return res.status(400).json({ message: 'Données manquantes : remplissez tous les champs' });
    }

    // Vérifier si l'utilisateur est un admin
    const userAdminsql = 'SELECT id_utilisateur FROM administrateur WHERE id_utilisateur = ?';
    connection.query(userAdminsql, [parseInt(userId)], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'admin :', err);
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification de l\'admin' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Échec : Admin non trouvé' });
        }

        const id_admin = results[0].id_utilisateur;

        // Insérer le document en enregistrant `nomdoc` et non `filePath`
        const insertDocSql = 'INSERT INTO document (id_type_doc, id_utilisateur, libelle_doc, titre) VALUES (?, ?, ?, ?)';
        connection.query(insertDocSql, [parseInt(id_typedoc), id_admin, libelledoc, nomdoc], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion du document :', err);
                return res.status(500).json({ message: 'Erreur serveur lors de l\'insertion du document' });
            }
            res.status(201).json({ message: 'Document créé avec succès', fileName: nomdoc });
        });
    });
});

// ➤ Route pour récupérer tous les documents
router.get('/', (req, res) => {
    const sql = `
      SELECT
        d.*, t.*, u.* 
      FROM document d 
        LEFT JOIN type_document t 
          ON t.id_type_doc = d.id_type_doc
        LEFT JOIN utilisateur u
          ON u.id_utilisateur = d.id_utilisateur;
    `;
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur interne du serveur');
        }
        res.json(results);
    });
});

// ➤ Route pour télécharger un document
router.get('/download/:id', (req, res) => {
    const docId = req.params.id;

    // Récupérer le nom du fichier
    const query = 'SELECT titre FROM document WHERE id_doc = ?';
    connection.query(query, [docId], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur interne du serveur');
        }
        
        if (results.length === 0) {
            return res.status(404).send('Document non trouvé');
        }

        const fileName = results[0].titre;
        const filePath = path.join(__dirname, '../../', 'uploads', fileName);

        // Vérifier si le fichier existe avant de le télécharger
        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                console.error('Fichier introuvable:', filePath);
                return res.status(404).send('Fichier non trouvé');
            }

            // Envoyer le fichier au client
            res.download(filePath, fileName, (err) => {
                if (err) {
                    if (!res.headersSent) {
                        console.error('Erreur téléchargement:', err);
                        res.status(500).send('Erreur lors du téléchargement du fichier');
                    }
                }
            });
        });
    });
});


export default router;