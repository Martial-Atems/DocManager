import express from 'express';
// import req from 'express/lib/request.js';
// import res from 'express/lib/response.js';
import connection  from '../../config/connection.js';
import storage  from '../../config/fileNames.js';
import fs from 'fs'; // Pour interagir avec le système de fichiers
import path from 'path'; // Pour manipuler les chemins de fichiers
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: storage });

// Route pour ajouter/soumettre un nouveau document
router.post('/', upload.single('nomdoc'), (req, res) => {
    const { userId, id_typedoc, libelledoc } = req.body;
    const nomdoc = req.file ? req.file.filename : null; // Stockage du nom du fichier au lieu du chemin complet

    if (!userId || !id_typedoc || !libelledoc || !nomdoc) {
        return res.status(400).json({ message: 'Données manquantes : remplissez tous les champs' });
    }

    const userAdminsql = 'SELECT id_utilisateur FROM administrateur WHERE id_utilisateur = ?';
    connection.query(userAdminsql, [parseInt(userId)], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'inscription :', err);
            return res.status(500).json({ message: 'Erreur serveur lors de la vérification de l\'admin' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Échec : Admin non trouvé' });
        }

        const id_admin = results[0].id_utilisateur;

        const insertDocSql = 'INSERT INTO document (id_type_doc, id_utilisateur, libelle_doc, titre) VALUES (?, ?, ?, ?)';
        connection.query(insertDocSql, [parseInt(id_typedoc), id_admin, libelledoc, nomdoc], (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion du document :', err);
                return res.status(500).json({ message: 'Erreur serveur lors de l\'insertion du document' });
            }
            res.status(201).json({ message: 'Document créé avec succès' });
        });
    });
});

// Route pour recuperer les Documents ds la Bdd.
router.get('/', (req, res) => {
    const sql = `
      SELECT
        d.*, t.*, u.* 
      FROM document d 
        left join type_document t 
          on t.id_type_doc = d.id_type_doc
        left join utilisateur u
          on u.id_utilisateur = d.id_utilisateur;
    `;
    connection.query(sql, (err, results) => {
      if(err) throw err;
      res.send(results);
    });
});

// Route pour télécharger un document
router.get('/download/:id', (req, res) => {
  const docId = req.params.id;

  // Requête qui récupère le chemin du fichier depuis la base de données
  const query = 'SELECT titre FROM document WHERE id_doc = ?';
  connection.query(query, [docId], (err, results) => {
      if (err || results.length === 0) {
          return res.status(404).send('Document non trouvé');
      }

      const filePath = results[0].titre;

      // Vérifier si le fichier existe
      if (fs.existsSync(filePath)) {
          res.download(filePath, path.basename(filePath), (err) => {
              if (err) {
                  console.error('Erreur lors du téléchargement du fichier:', err);
                  res.status(500).send('Erreur lors du téléchargement du fichier');
              }
          });
      } else {
          res.status(404).send('Fichier non trouvé');
      }
  });
});

export default router;