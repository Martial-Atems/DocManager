// Fonction pour l'ajout d'un étudiant
document.getElementById('modalAjoutEtudiantForm').addEventListener("submit", async function(event) {
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
    const etudiant = document.getElementById('etudiant').value.trim();
    const filiere = document.getElementById('filiere').value.trim();
    const niveau = document.getElementById('niveau').value.trim();

    // Récupération des éléments des messages d'erreur et de success
    const nomEtudError = document.getElementById('nomEtudError');
    const nomFilError = document.getElementById('nomFilError');
    const nomNivError = document.getElementById('nomNivError');

    const successMessage = document.getElementById('successMessage');

    let formValidModal = true; // État de validation du formulaire

    // Réinitialisation des messages d'erreur
    hideErrorModal(nomNivError);

    // Vérification des champs
    if (etudiant === "") {
        showErrorModal(nomEtudError, 'Ce champ ne doit pas être vide');
        formValidModal = false;
    }
    if (filiere === "") {
        showErrorModal(nomFilError, 'Ce champ ne doit pas être vide');
        formValidModal = false;
    }
    if (niveau === "") {
        showErrorModal(nomNivError, 'Ce champ ne doit pas être vide');
        formValidModal = false;
    }

    if (formValidModal) {
        const formData = new FormData(event.target);
        const data = {
            etudiant: formData.get('etudiant'),  
            filiere: formData.get('filiere'),    
            niveau: formData.get('niveau')
        };

        try {
            // Envoi des données au serveur
            const response = await fetch('http://localhost:5000/etudiants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Erreur serveur");

            // Affichage du message de succès
            successMessage.textContent = "Enregistrement réussi de l'étudiant";
            successMessage.style.display = "block";

            // Attendre 3 secondes avant rechargement de la page
            setTimeout(() => {
                location.reload();
            }, 100);
        } catch (error) {
            console.error('Erreur:', error);
            showErrorModal(nomNivError, "Échec de l'enregistrement. Veuillez réessayer !");
        }
    }
});