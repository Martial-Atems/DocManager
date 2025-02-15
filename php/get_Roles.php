<?php
// Connexion à la base de données
include "./config/index.php";
$pdo = new PDO("mysql:host=localhost;dbname=ta_base_de_donnees", "utilisateur", "mot_de_passe");

// Vérifier si l'ID du rôle est passé en paramètre
if (isset($_GET['id'])) {
    $roleId = $_GET['id'];

    // Requête SQL pour récupérer les informations du rôle
    $stmt = $pdo->prepare("SELECT * FROM roles WHERE id = ?");
    $stmt->execute([$roleId]);

    // Récupérer les données sous forme de tableau associatif
    $role = $stmt->fetch(PDO::FETCH_ASSOC);

    // Renvoyer les données sous format JSON
    echo json_encode($role);
}
?>