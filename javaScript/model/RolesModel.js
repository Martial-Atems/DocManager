// Script/fonction pour ajouter les roles dans base de donnees
document.getElementById('formAjoutRole').addEventListener("submit", async function(event) {
    event.preventDefault();

    // Fonction pour afficher l'erreur sur le formulaire
    function showErrorModal(element, message) {
        element.style.display = 'block';
        element.textContent = message;
    }

    // Fonction pour cacher  l'erreur
    function hideErrorModal(element) {
        element.style.display = 'none';
    }

    const nomRole = document.getElementById('nomRole').value.trim();
    let formValidModal = true;

    const nomRoleError = document.getElementById('nomRoleError');
    hideErrorModal(nomRoleError);

    if (nomRole === "") {
        showErrorModal(nomRoleError, 'Le nom du rôle ne doit pas etre vide !');
        formValidModal = false;
    }

    if (formValidModal) {
        const data = { nomRole };

        try {
            const response = await fetch('http://localhost:5000/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Erreur serveur");

            // Afficharge du message de succès
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = "Enregistrement réussi du rôle!";
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
});

// Script/fonction pour afficher les donnees sur la page de la Gestion des roles

document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/roles')
    .then(Response => Response.json())
    .then(role => {
        const tableBody = document.getElementById('role-table-body');
        role.forEach(rol => {
            // Chargement de la page roles.html
            const row = document.createElement('tr');
            row.innerHTML = `
                <td id="roleId">${rol.id_role}</td>
                <td>${rol.nomRole}</td>
                <td>
                    <a href="/html/administrateur/updateRole.html?id=${rol.id_role}&nom=${rol.nomRole}" style = "text-decoration: none;" class="btn btn-primary btn-sm" > Modifier </a>

                    <a href="/html/administrateur/deleteRole.html?id=${rol.id_role}" style = "text-decoration: none;" class="btn btn-danger btn-sm deleteRoleBtn" > Supprimer </a>
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
});