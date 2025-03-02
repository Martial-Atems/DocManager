<?php
$server = "localhost";
$user = "root";
$mdp = "";
$dbname = "DocManager";

try{
    $con = new PDO("mysql:host=$server;dbname=$dbname", $user, $mdp);
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $con->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
}catch(PDOException $e){
    echo "erreur de connexion a la base de donnees !"."<p style='color:red'>".$e->getMessage()."</p>";
}
