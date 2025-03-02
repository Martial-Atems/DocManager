<<<<<<< HEAD
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
=======
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
>>>>>>> 542e4fef0fe630f66727a9a546df5c4056eb763a
// setInterval(afficherHeureEtDate, 1000);