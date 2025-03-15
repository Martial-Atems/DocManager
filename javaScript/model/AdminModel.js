// Fonction pour l'ajout d'un étudiant
document.getElementById('modalAjoutAdminForm').addEventListener("submit", async function(event) {
    event.preventDefault();

    // Fonction pour afficher les messages d'erreur
    function showErrorModal(element, message) {
        element.style.display = 'block';
        element.textContent = message;
    }

    // Fonction pour cacher les messages d'erreur
    function hideErrorModal(element) {
        element.style.display = 'none';
    }

    // Récupération des valeurs des champs du formulaire
    const administrateur = document.getElementById('administrateur').value.trim();

    // Récupération des éléments des messages d'erreur et de success
    const nomAdmError = document.getElementById('nomAdmError');
    const successMessage = document.getElementById('successMessage');

    let formValidModal = true; // État de validation du formulaire

    // Réinitialisation des messages d'erreur
    hideErrorModal(nomAdmError);

    // Vérification des champs
    if (administrateur === "") {
        showErrorModal(nomAdmError, 'Ce champ ne doit pas être vide');
        formValidModal = false;
    }

    if (formValidModal) {
        const formData = new FormData(event.target);
        const data = {
            administrateur: formData.get('id_utilisateur')
        };

        console.log(data);

        try {
            // Envoi des données au serveur
            const response = await fetch('http://localhost:5000/admins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Erreur serveur");

            // Affichage du message de succès
            successMessage.textContent = "Enregistrement réussi de l'administrateur";
            successMessage.style.display = "block";

            // Attendre 3 secondes avant rechargement de la page
            setTimeout(() => {
                location.reload();
            }, 100);
        } catch (error) {
            console.error('Erreur:', error);
            showErrorModal(nomAdmError, "Échec de l'enregistrement. Veuillez réessayer !");
        }
    }
});