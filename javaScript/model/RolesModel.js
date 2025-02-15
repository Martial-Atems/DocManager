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

    if (nomRole === "" || nomRole.length < 5) {
        showErrorModal(nomRoleError, 'Le nom du rôle doit contenir au moins 5 caractères.');
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
                    <button type="button" class="btn btn-warning btn-sm editRoleBtn"
                    data-bs-toggle="modal" data-bs-target="#modalUpdateRole"
                     onclick="updateRoleBtn()"
                    data-id="${rol.id_role}"
                    data-nom="${rol.nomRole}"
                    >Modifier</button> 
                    <button type="button" class="btn btn-danger btn-sm deleteRoleBtn"
                    data-bs-toggle="modal" data-bs-target="#modalDeleteRole"
                      onclick="deleteRoleBtn()"
                    data-id="${rol.id_role}"
                    >Supprimer</button> 
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
});

// // Fonction pour afficher les information du role sur le formulaire de modification du role
// function updateRoleBtn() {
//     $('.editRoleBtn').on('click', function() {
//         // Recuperation des donnees de la ligne du tableau
//         const roleId = $(this).data('id');
//         const nomRole = $(this).data('nom');
        
//         // Remplissage du formulaire de modification du role
//         $('#roleId').val(roleId);
//         $('#nom_role').val(nomRole);
//     })

// } 
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.editRoleBtn').forEach(button => {
        button.addEventListener('click', function() {
            const roleId = this.dataset.id; // Correction ici

            alert(roleId);
            
            // Requête AJAX pour récupérer les infos du rôle
            fetch(`../php/get_Roles.php?id=${roleId}`)
                .then(response => response.json())
                .then(data => {
                    // Remplir les champs du formulaire avec les données récupérées
                    document.getElementById('roleId').value = data.id;
                    document.getElementById('nom_role').value = data.nom;
                })
                .catch(error => console.error('Erreur:', error));
        });
    });
});



// Modification du role
document.querySelector('.updateDataRole').addEventListener("click", async function(event) {
    event.preventDefault();

    const roleId = document.getElementById('roleId').value;

    const nomRoleErrorEdit = document.getElementById('nomRoleErrorEdit');

    const data = {nom_role: nom_role.value};
    try {
        const response = await fetch(`http://localhost:5000/roles/${roleId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Erreur serveur");

        // Afficharge du message de succès
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = "Modification réussi du rôle!";
        successMessage.style.display = "block";

        // Attendre 3 secondes avant rechargement de la page
        setTimeout(() => {
            location.reload();
        }, 3000);
    } catch (error) {
        console.error('error:', error);
        showErrorModal(nomRoleErrorEdit, "Échec de l'enregistrement. Veuillez réessayer !");
    }
});