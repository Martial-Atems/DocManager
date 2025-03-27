import multer from 'multer';

// Configuration de multer pour gérer l'upload de fichiers
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // fichier avec son nom original
    }
});

export default storage;