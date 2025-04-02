//Script pour afficher les documents 
document.addEventListener('DOMContentLoaded', function() {
    // Récupère et affiche les types de documents dans le select
    fetch('http://localhost:5000/typedocuments')
        .then(response => response.json())
        .then(typeDocument => {
            const typeDocSelect = document.getElementById('typeDocSelect')
            typeDocSelect.innerHTML = '<option value=""> </option>'; //option vide
            typeDocument.forEach(function(typeDoc) {
                let option = document.createElement('option');
                option.value = typeDoc.id_type_doc;  // Utilise l'id comme valeur
                option.textContent = typeDoc.libelle_type_doc;  // Affiche le nom du type de document
                typeDocSelect.appendChild(option);
            });
        })
});

//Script pour ajouter/soumettre un document
document.getElementById('rapportForm').addEventListener("submit", async function(event) {
    event.preventDefault();

    function showError(element, message) {
        element.textContent = message;
        element.classList.remove('d-none');
    }

    function hideError(element) {
        element.classList.add('d-none');
    }

    // Réinitialisation des erreurs
    const typeDocError = document.getElementById('typeDocError');
    const libelleDocError = document.getElementById('nomLibDocError');
    const nomDocError = document.getElementById('nomDocError');
    const successMessage = document.getElementById('successMessage');

    hideError(typeDocError);
    hideError(libelleDocError);
    hideError(nomDocError);
    successMessage.classList.add('d-none');

    // Récupération des valeurs
    const nomTypeDoc = document.getElementById('typeDocSelect').value.trim();
    const libelledoc = document.getElementById('libelledoc').value.trim();
    const nomDoc = document.getElementById('nomdoc').files[0];

    let formValid = true;

    if (nomTypeDoc === "") {
        showError(typeDocError, 'Veuillez sélectionner un type de document');
        formValid = false;
    }
    if (libelledoc === "") {
        showError(libelleDocError, 'Veuillez entrer un libellé du document');
        formValid = false;
    }
    if (!nomDoc) {
        showError(nomDocError, 'Veuillez sélectionner un fichier');
        formValid = false;
    }

    if (!formValid) return;

    const formData = new FormData();
    formData.append('id_typedoc', nomTypeDoc);
    formData.append('libelledoc', libelledoc);
    formData.append('nomdoc', nomDoc);

    const userId = localStorage.getItem('storageKey');
    if (!userId) {
        showError(nomDocError, "Utilisateur non authentifié.");
        return;
    }

    formData.append('userId', userId);

    try {
        const response = await fetch('http://localhost:5000/rapports', { 
            method: 'POST', 
            body: formData 
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Erreur serveur");

        successMessage.textContent = "Document ajouté avec succès !";
        successMessage.classList.remove('d-none');
        setTimeout(() => location.reload(), 3000);
    } catch (error) {
        showError(nomDocError, "Erreur lors de l'ajout du document.");
        console.error("Erreur:", error);
    }
});

// Affichage des donnees(rapport de l'etudiant)
document.addEventListener('DOMContentLoaded', function() {
    // Recuperation de l'id du localStorage
    const userId = localStorage.getItem('storageKey');

    // Envoie des donnees par fetch
    fetch(`http://localhost:5000/rapports/${userId}`)
    .then(response => response.json())
    .then(documents => {
        
        const tableBody = document.getElementById('documents-table');
        documents.forEach(doc => {
            // Création d'une nouvelle ligne pour chaque document
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.id_doc}</td>
                <td>${doc.libelle_type_doc}</td>
                <td>${doc.libelle_doc}</td>
                <td>${doc.titre}</td>
                <td> 
                    <button type="button" class="btn btn-success btn-sm" data-id="${doc.id_doc}" data-nomdoc="${doc.titre}" onclick="downloadFunction(this)">
                        Télécharger
                    </button> 
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
});