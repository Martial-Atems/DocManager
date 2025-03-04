// Script pour Ajouter une session
document.getElementById('formAjoutSes').addEventListener("submit", async function(event) {
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
    const debutSes = document.getElementById('debutSes').value.trim();
    const finSes = document.getElementById('finSes').value.trim();
    const libSes = document.getElementById('libSes').value.trim();
    let formValidModal = true; //Etat de validation du formulaire

    // Reinitialisation des messages d'erreur.
    hideErrorModal(document.getElementById('debutSesError'));
    hideErrorModal(document.getElementById('finSesError'));
    hideErrorModal(document.getElementById('libSesError'));

    // Verification du champs
    if (debutSes === "") {
        showErrorModal(document.getElementById('debutSesError'), 'Ce champs ne doit pas être vide');
        formValidModal = false;
    }
    
    if (finSes === "") {
        showErrorModal(document.getElementById('finSesError'), 'Ce champs ne doit pas être vide');
        formValidModal = false;
    }
    
    if (libSes === "") {
        showErrorModal(document.getElementById('libSesError'), 'Ce champs ne doit pas être vide');
        formValidModal = false;
    }

    // Si champs valide
    if (formValidModal) {
        const formData = new FormData(event.target);
        const data = {
            debutSes: formData.get('date_Debut'),
            finSes: formData.get('date_Fin'),
            libSes: formData.get('libelle_Session'),
        };

        try {
            // Envoi des donnees au serveur 
            const response = await fetch('http://localhost:5000/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Erreur serveur");

            // Afficharge du message de succès
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = "Enregistrement réussi de la session";
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


// Recuperation des donnees de la table session et les affichers
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/sessions')
    .then(Response => Response.json())
    .then(session => {
        const tableBody = document.getElementById('session-table-body');
        session.forEach(ses => {
            // Chargement de la page GestionFaculter.html
            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="sesId">${ses.id_ses}</td>
                <td>${ses.dateDebut}</td>
                <td>${ses.dateFin}</td>
                <td>${ses.libelleSes}</td>
                <td>${ses.statut}</td>
                <td>
                    <button class="btn btn-success btn-sm _BtnIcones" data-id="${ses.id_ses}" title="Activer la session" data-bs-toggle="modal" data-bs-target="#activateModal">
                        <i class="fa-solid fa-check"></i>
                    </button> 
                    <button class="btn btn-primary btn-sm _BtnIcones" data-id="${ses.id_ses}" title="Desactiver la session" data-bs-toggle="modal" data-bs-target="#deactivateModal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                    <a href="/html/administrateur/updateSession.html?id=${ses.id_ses}&debut=${ses.dateDebut}&fin=${ses.dateFin}&libelle=${ses.libelleSes}" style = "text-decoration: none;" class="btn btn-primary btn-sm" > Modifier </a>
                    <a href="/html/administrateur/deleteSession.html?id=${ses.id_ses}" style = "text-decoration: none;" class="btn btn-danger btn-sm deleteRoleBtn" > Supprimer </a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
});

// Script pour activer et desactiver une session 
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/statuts')
    .then(response => response.json())
    .then(session => {
        session.forEach(ses => {
            const button = document.querySelector('._BtnIcones');
            if (button) { // Vérifier si le bouton existe
                if (ses.statut === 'Activer') {
                    button.querySelector('.fa-xmark').style.display = 'none';
                    button.querySelector('.fa-check').style.display = 'inline';
                } else {
                    button.querySelector('.fa-xmark').style.display = 'inline';
                    button.querySelector('.fa-check').style.display = 'none';
                }
            } else {
                console.error(`Aucun bouton trouvé pour l'ID ${ses.id_ses}`);
            }
        });
    })
    .catch(error => console.error('Erreur:', error));
});
    
// Fonction pour activer une session
function _btnActive(button) {
    const sesId = button.getAttribute('data-id');

    // Envoyer la requête PATCH pour activer la session
    fetch(`http://localhost:5000/statuts/${sesId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statut: 'Activer' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de l\'activation de la session');
        }
        return response.json();
    })
    .then(data => {
        // Mettre à jour l'interface utilisateur
        button.disabled = true; // Griser le bouton "Activer"
        button.classList.remove('btn-success');
        button.classList.add('btn-secondary');

        // Mettre à jour le bouton "Désactiver"
        const desactivateButton = button.parentElement.querySelector('button[title="Désactiver la session"]');
        desactivateButton.disabled = false;
        desactivateButton.classList.remove('btn-secondary');
        desactivateButton.classList.add('btn-primary');

        // Désactiver tous les autres boutons "Activer" (une seule session active à la fois)
        document.querySelectorAll('button[title="Activer la session"]').forEach(btn => {
            if (btn !== button) {
                btn.disabled = true;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-secondary');
            }
        });
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de l\'activation de la session.');
    });
}

// Fonction pour désactiver une session
function _btnDesactive(button) {
    const sesId = button.getAttribute('data-id');

    // Envoyer la requête PATCH pour désactiver la session
    fetch(`http://localhost:5000/statuts/${sesId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statut: 'Désactiver' })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la désactivation de la session');
        }
        return response.json();
    })
    .then(data => {
        // Mettre à jour l'interface utilisateur
        button.disabled = true; // Griser le bouton "Désactiver"
        button.classList.remove('btn-primary');
        button.classList.add('btn-secondary');

        // Mettre à jour le bouton "Activer"
        const activateButton = button.parentElement.querySelector('button[title="Activer la session"]');
        activateButton.disabled = false;
        activateButton.classList.remove('btn-secondary');
        activateButton.classList.add('btn-success');
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la désactivation de la session.');
    });
}

// Fonction pour initialiser l'état des boutons au chargement de la page
function initializeButtons() {
    // Récupérer l'état de la session depuis le serveur
    fetch('http://localhost:5000/statuts')
    .then(response => response.json())
    .then(data => {
        data.forEach(session => {
            const activateButton = document.querySelector(`button[data-id="${session.id_ses}"][title="Activer la session"]`);
            const desactivateButton = document.querySelector(`button[data-id="${session.id_ses}"][title="Désactiver la session"]`);

            if (session.statut === 'Activer') {
                // Désactiver le bouton "Activer" et activer le bouton "Désactiver"
                activateButton.disabled = true;
                activateButton.classList.remove('btn-success');
                activateButton.classList.add('btn-secondary');

                desactivateButton.disabled = false;
                desactivateButton.classList.remove('btn-secondary');
                desactivateButton.classList.add('btn-primary');
            } else {
                // Désactiver le bouton "Désactiver" et activer le bouton "Activer"
                desactivateButton.disabled = true;
                desactivateButton.classList.remove('btn-primary');
                desactivateButton.classList.add('btn-secondary');

                activateButton.disabled = false;
                activateButton.classList.remove('btn-secondary');
                activateButton.classList.add('btn-success');
            }
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des statuts des sessions:', error);
    });
}

// Appeler la fonction d'initialisation au chargement de la page
window.onload = initializeButtons;