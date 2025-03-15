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