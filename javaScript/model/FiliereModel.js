// Script pour afficher les faculters sur le select d'ajout des filieres 
window.onload = function() {
    const faculterSelect = document.getElementById('faculterSelect');

    // Récupère les faculters depuis l'API backend
    fetch('http://localhost:5000/faculters')
    .then(response => response.json())
    .then(faculter => {
        // Ajoute chaque faculters comme une option dans le select
        faculter.forEach(function(fac) {
        let option = document.createElement('option');

        option.value = fac.id_faculter;  // Utilise l'id_role comme valeur
        option.textContent = fac.nomFac;  // Affiche le nom du rôle

        faculterSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Erreur:', error));
}

// Script pour Ajouter une filiere
document.getElementById('formAjoutFil').addEventListener("submit", async function(event) {
    event.preventDefault();
    // Fonction pour afficher les message d'erreur
    function showErrorModal(element, message) {
        element.style.display = 'block';
        element.textContent = message;
    }

    // Fonction pour cacher les massage d'errerur
    function hideErrorModal(element, message) {
        element.style.display = 'none';
    }

    // Recuperation des valeurs des champs du formulaire
    const faculterSelect = document.getElementById('faculterSelect').value.trim();
    const nomFil = document.getElementById('nomFil').value.trim();

    let formValidModal = true; //Etat de validation du formulaire

    // Reinitialisation des messages d'erreur.
    hideErrorModal(document.getElementById('nomFilError'));

    // Verification du champs
    if (nomFil === "") {
        showErrorModal(document.getElementById('nomFilError'), 'Ce champs ne doit pas être vide');
        formValidModal = false;
    }

    // Si champs valide
    if (formValidModal) {
        const formData = new FormData(event.target);
        const data = {
            faculter: formData.get('id_faculter'),
            nomFil: formData.get('nomFil')
        };

        try {
            // Envoi des donnees au serveur 
            const response = await fetch('http://localhost:5000/filieres', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Erreur serveur");

            // Afficharge du message de succès
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = "Enregistrement réussi de la filiere";
            successMessage.style.display = "block";

            // Attendre 3 secondes avant rechargement de la page
            setTimeout(() => {
                location.reload();
            }, 3000);
        } catch (error) {
            console.error('error:', error);
            showErrorModal(nomFilError, "Échec de l'enregistrement. Veuillez réessayer !");
        }
    }
})

// Script pour afficher les donnees sur la page de la Gestion des filieres

// Recuperation des donnees de la table filiere et les affichers
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/filieres')
    .then(Response => Response.json())
    .then(filiere => {
        const tableBody = document.getElementById('filiere-table-body');
        filiere.forEach(fil => {
            // Chargement de la page GestionFaculter.html
            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="filId">${fil.id_filiere}</td>
                <td>${fil.nomFac}</td>
                <td>${fil.nomFiliere}</td>
                <td>
                    <a href="/html/administrateur/updateFiliere.html?id=${fil.id_filiere}&nom=${fil.nomFiliere}" style = "text-decoration: none;" class="btn btn-primary btn-sm" > Modifier </a>

                    <a href="/html/administrateur/deleteFiliere.html?id=${fil.id_filiere}" style = "text-decoration: none;" class="btn btn-danger btn-sm deleteRoleBtn" > Supprimer </a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
});