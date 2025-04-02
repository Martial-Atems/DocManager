// Script pour la recuperation des donnees du formulaire pour les renvoyer au niveau du serveur express.
function soumettreModalForm(event) {
    document.getElementById('modalAjoutForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        function showErrorModal(element, message) {
            element.style.display = 'block';
            element.textContent = message;
        }

        function hideErrorModal(element) {
            element.style.display = 'none';
        }

        function emptyset() { // vider les champs du formulaire
            document.getElementById('nom').value = "";
            document.getElementById('prenom').value = "";
            document.getElementById('dateNais').value = "";
            document.getElementById('lieuNais').value = "";
            document.getElementById('sexe').value = "";
            document.getElementById('adresse').value = "";
            document.getElementById('phone').value = "";
            document.getElementById('email').value = "";
            document.getElementById('password').value = "";
        }

        const roleSelect = document.getElementById('roleSelect').value.trim();
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const date_nais = document.getElementById('dateNais').value.trim();
        const lieu_nais = document.getElementById('lieuNais').value.trim();
        const sexe = document.getElementById('sexe').value.trim();
        const adresse = document.getElementById('adresse').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        let formValidModal = true;
        hideErrorModal(document.getElementById('roleError'));
        hideErrorModal(document.getElementById('nomError'));
        hideErrorModal(document.getElementById('prenomError'));
        hideErrorModal(document.getElementById('dateError'));
        hideErrorModal(document.getElementById('lieuNaisError'));
        hideErrorModal(document.getElementById('sexeError'));
        hideErrorModal(document.getElementById('adresseError'));
        hideErrorModal(document.getElementById('phoneError'));
        hideErrorModal(document.getElementById('emailError'));
        hideErrorModal(document.getElementById('passwordError'));

        if (roleSelect === '') {
            showErrorModal(document.getElementById('roleError'), 'Le role ne doit pas être vide');
            formValidModal = false;
        }
        if (nom === '') {
            showErrorModal(document.getElementById('nomError'), 'Le nom ne doit pas être vide');
            formValidModal = false;
        }
        if (prenom === '') {
            showErrorModal(document.getElementById('prenomError'), 'Le prénom ne doit pas être vide');
            formValidModal = false;
        }
        if (date_nais === '') {
            showErrorModal(document.getElementById('dateError'), 'selectionnez la date naissance');
            formValidModal = false;
        }
        if (lieu_nais === '') {
            showErrorModal(document.getElementById('lieuNaisError'), 'Le lieu de naissance ne doit pas être vide');
            formValidModal = false;
        }
        if (sexe === '') {
            showErrorModal(document.getElementById('sexeError'), 'Le sexe ne doit pas être vide');
            formValidModal = false;
        }
        if (adresse === '') {
            showErrorModal(document.getElementById('adresseError'), 'L\'adresse ne doit pas être vide');
            formValidModal = false;
        }
        if (phone === '') {
            showErrorModal(document.getElementById('phoneError'), 'Le téléphone ne doit pas être vide');
            formValidModal = false;
        }
        if (email === '') {
            showErrorModal(document.getElementById('emailError'), 'L\'adresse mail ne doit pas être vide');
            formValidModal = false;
        }
        if (password === '') {
            showErrorModal(document.getElementById('passwordError'), 'Le mot de passe ne doit pas être vide');
            formValidModal = false;
        }

        if (formValidModal) {
            const formDataModal = new FormData(event.target);
            const dataModal = {
                id: formDataModal.get('id_users'),
                role: formDataModal.get('id_role'),
                nom: formDataModal.get('nom_user'),
                prenom: formDataModal.get('prenom_user'),
                datenais: formDataModal.get('date_nais'),
                lieunais: formDataModal.get('lieu_nais'),
                sexe: formDataModal.get('sexe'),
                adresse: formDataModal.get('adresse'),
                phone: formDataModal.get('numero_tel'),
                email: formDataModal.get('adresse_mail'),
                password: formDataModal.get('mot_de_passe')
            };

            try {
                const response = await fetch('http://localhost:5000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataModal)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Erreur serveur");
                }

                const successMessage = document.getElementById('successMessage');
                successMessage.textContent = "Utilisateur ajouté avec succès";
                successMessage.style.display = "block";

                setTimeout(() => {
                    emptyset();
                    successMessage.style.display = "none";
                    location.reload();
                }, 3000);
            } catch (error) {
                console.error('error:', error);
                showErrorModal(document.getElementById('nomError'), "Échec de l'enregistrement. Veuillez réessayer !");
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    soumettreModalForm();
});

//script pour recuperer les donnees de la table users et les afficher dans la page
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5000/users')
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des utilisateurs");
        }
        return response.json();
    })
    .then(users => {
        const tableBody = document.getElementById('users-table-body');

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id_utilisateur}</td>
                <td>${user.nomRole}</td>
                <td>${user.nom}</td>
                <td class="hide-on-small">${user.prenom}</td>
                <td class="hide-on-small">${user.sexe}</td>
                <td class="hide-on-small">${user.adresse}</td>
                <td class="hide-on-small">${user.numeroTel}</td>
                <td>
                    <a href="/html/administrateur/deleteUsers.html?id=${user.id_utilisateur}" class="btn btn-danger btn-sm">Supprimer</a>
                    <a href="/html/administrateur/updateUsers.html?id=${user.id_utilisateur}&id_role=${user.nomRole}&nom=${user.nom}&prenom=${user.prenom}&datenais=${user.dateNais}&lieunais=${user.lieuNais}&sexe=${user.sexe}&adresse=${user.adresse}&tel=${user.numeroTel}" class="btn btn-primary btn-sm">Modifier</a>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Initialisation de DataTables après le chargement des données
        $('#dataTablese').DataTable({
            responsive: true,
            stateSave: true,
            language: {
                // url: "//cdn.datatables.net/plug-ins/1.11.5/i18n/French.json"
            }
        });

    })
    .catch(error => {
        console.error("Erreur lors du chargement des utilisateurs :", error);
    });
});