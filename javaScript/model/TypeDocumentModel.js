 // Script pour Ajouter un type de document
 document.getElementById('formAjoutTypeDoc').addEventListener("submit", async function(event) {
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
    const nomTypeDoc = document.getElementById('nomTypeDoc').value.trim();

    let formValidModal = true; //Etat de validation du formulaire

    // Reinitialisation des messages d'erreur.
    hideErrorModal(document.getElementById('nomTypeDocError'));

    // Verification du champs
    if (nomTypeDoc === "") {
        showErrorModal(document.getElementById('nomTypeDocError'), 'Ce champs ne doit pas être vide');
        formValidModal = false;
    }

    // Si champs valide
    if (formValidModal) {
        const formData = new FormData(event.target);
        const data = {
            nomTypeDoc: formData.get('nom_typedoc')
        };

        try {
            // Envoi des donnees au serveur 
            const response = await fetch('http://localhost:5000/typedocuments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error("Erreur serveur");

            // Afficharge du message de succès
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = "Enregistrement réussi du type de document";
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

 // Script pour afficher les donnees sur la page de la typeDocument.html

        // Recuperation des donnees de la table typeDocument et les affichers
        document.addEventListener('DOMContentLoaded', function() {
            fetch('http://localhost:5000/typedocuments')
            .then(Response => Response.json())
            .then(typeDocument => {
                const tableBody = document.getElementById('typeDoc-table-body');
                typeDocument.forEach(typeDoc => {
                    // Chargement de la page typeDocument.html
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td id="typedocId">${typeDoc.id_type_doc}</td>
                        <td>${typeDoc.libelle_type_doc}</td>
                        <td>
                  
                            <a href="/html/administrateur/updateTypeDocument.html?id=${typeDoc.id_type_doc}&nom=${typeDoc.libelle_type_doc}" style = "text-decoration: none;" class="btn btn-primary btn-sm" > Modifier </a>

                            <a href="/html/administrateur/deleteTypeDocument.html?id=${typeDoc.id_type_doc}" style = "text-decoration: none;" class="btn btn-danger btn-sm deleteTypeDocBtn" > Supprimer </a>
                        
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            });
        });