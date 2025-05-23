function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('collapsed');
}

// // Afficharge de l'heure et de la date automatique
// const heureElement = document.getElementById('heure');
// const dateElement = document.getElementById('date');

// function afficherHeureEtDate() {
//     const dateActuelle = new Date();
//     const heure = dateActuelle.getHours();
//     const minute = dateActuelle.getMinutes();
//     const seconde = dateActuelle.getSeconds();
//     const jour = dateActuelle.getDate();
//     const mois =dateActuelle.getMonth() + 1;
//     const annee = dateActuelle.getFullYear();
//     const Heures = `${jour}/${mois}/${annee}`;
//     const Dates = `${heure}:${minute}:${seconde}`;

//     // affichage
//     heureElement.textContent = Heures;
//     dateElement.textContent = Dates;
// }

// afficherHeureEtDate();

// // Mettre a jour l'heure et la date toutes les secondes
// setInterval(afficherHeureEtDate, 1000);

function toggleProfile(event) {
    event.stopPropagation();
    const profile = document.getElementById("profile");
    profile.style.display = profile.style.display === "none" ? "block" : "none";
}

function hideProfile(event) {
    const profile = document.getElementById("profile");
    if (profile.style.display === "block" && !profile.contains(event.target)) {
        profile.style.display = "none";
    }
}

// Script pour la deconnection
function log_out(){     
    // recuperation de l'id dans le localStorage
    const userId = localStorage.getItem('storageKey');
    // Supprimer l'ID de l'utilisateur du localStorage
    localStorage.removeItem('storageKey');
    // Rediriger vers la page d'accueil
    window.location.href = '../choixUsers.html';
}