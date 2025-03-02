// Script pour la recuperation des donnees du formulaire pour les renvoyer au niveau du serveur express.
function soumettreModalForm(event) {
    // Recuperation des donnees du formulaire
    document.getElementById('modalAjoutForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Empêche la soumission par defaut du formulaire
        
        // Fonction pour afficher un message d'erreur
        function showErrorModal(element, message) {
            element.style.display = 'block'; // Affiche un message d'erreur
            element.textContent = message;
        }

        // Fonction pour cacher un message d'erreur
        function hideErrorModal(element) {
            element.style.display = 'none'; // Cache le message d'erreur
        }

        // Récupération des valeurs des champs du formulaire
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

        let formValidModal = true; // Utilisée pour suivre l'état de la validation du formulaire
        // Réinitialiser les messages d'erreur
        hideErrorModal(document.getElementById('nomError'));
        hideErrorModal(document.getElementById('prenomError'));
        hideErrorModal(document.getElementById('lieuNaisError'));
        hideErrorModal(document.getElementById('adresseError'));
        hideErrorModal(document.getElementById('phoneError'));
        hideErrorModal(document.getElementById('emailError'));
        hideErrorModal(document.getElementById('passwordError'));

        // Vérifications des champs
        if (nom === '') {
            showErrorModal(document.getElementById('nomError'), 'Le nom doit avoir au moins cinq caractères');
            formValidModal = false;
        }
        if (prenom === '') {
            showErrorModal(document.getElementById('prenomError'), 'Le prénom ne doit pas être vide');
            formValidModal = false;
        }
        if (lieu_nais === '') {
            showErrorModal(document.getElementById('lieuNaisError'), 'Le lieu de naissance ne doit pas être vide');
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
                // Envoi des données au serveur express avec une requête fetch
                const response = await fetch('http://localhost:5000/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataModal)
                });
                var status = response.status;
            } catch (error) {
                console.error('Error:', error);
            }
            if (status !== 500) {
                alert("Enregistrement réussi");
                location.reload(); // Pour recharger la page et afficher les modifications
            } else {
                alert("Enregistrement échoué");
            }
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    soumettreModalForm();
});   