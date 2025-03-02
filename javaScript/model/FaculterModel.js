// Script pour Ajouter une faculter
document.getElementById('formAjouteFac').addEventListener("submit", async function(event) {
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
    const nomFac = document.getElementById('nomFac').value.trim();

    let formValidModal = true; //Etat de validation du formulaire

    // Reinitialisation des messages d'erreur.
    hideErrorModal(document.getElementById('nomFacError'));

    // Verification du champs
    if (nomFac === "") {
        showErrorModal(document.getElementById('nomFacError'), 'Ce champs ne doit pas être vide');
        formValidModal = false;
    }

    // Si champs valide
    if (formValidModal) {
        const formData = new FormData(event.target);
        const data = {
            nomFac: formData.get('nom_faculter')
        };

        try {
            // Envoi des donnees au serveur 
            const response = await fetch('http://localhost:5000/faculters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Erreur serveur");

            // Afficharge du message de succès
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = "Enregistrement réussi de faculter";
            successMessage.style.display = "block";

            // Attendre 3 secondes avant rechargement de la page
            setTimeout(() => {
                location.reload();
            }, 3000);
        } catch (error) {
            console.error('error:', error);
            showErrorModal(nomRoleError, "Échec de l'enregistrement. Veuillez réessayer !");
        }
    }
})

// Recuperation des donnees de la table faculter et les affichers
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/faculters')
    .then(Response => Response.json())
    .then(faculter => {
        const tableBody = document.getElementById('faculter-table-body');
        faculter.forEach(fac => {
            // Chargement de la page GestionFaculter.html
            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="facId">${fac.id_faculter}</td>
                <td>${fac.nomFac}</td>
                <td>
                    <a href="/html/administrateur/updateFaculter.html?id=${fac.id_faculter}&nom=${fac.nomFac}" style = "text-decoration: none;" class="btn btn-primary btn-sm" > Modifier </a>

                    <a href="/html/administrateur/deleteFaculter.html?id=${fac.id_faculter}" style = "text-decoration: none;" class="btn btn-danger btn-sm deleteRoleBtn" > Supprimer </a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
});