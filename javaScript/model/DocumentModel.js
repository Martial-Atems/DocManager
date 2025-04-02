//Script pour afficher les documents 

document.addEventListener('DOMContentLoaded', function() {
    fetchDocuments(); // Initial fetch to load all documents
    // Récupère et affiche les types de documents dans le select
    fetch('http://localhost:5000/typedocuments')
        .then(response => response.json())
        .then(typeDocument => {
            const typeDocSelect = document.getElementById('typeDocSelect');
            const typeDocSelect1 = document.getElementById('typeDocSelect1')
            typeDocSelect1.innerHTML = '<option value=""> </option>'; //option vide
            typeDocument.forEach(function(typeDoc) {
                let option = document.createElement('option');
                option.value = typeDoc.libelle_type_doc;  // Utilise le nom_typedoc comme valeur
                option.textContent = typeDoc.libelle_type_doc;  // Affiche le nom du type de document
                typeDocSelect.appendChild(option);
                let option1 = document.createElement('option');
                option1.value = typeDoc.id_type_doc;  // Utilise l'id comme valeur
                option1.textContent = typeDoc.libelle_type_doc;  // Affiche le nom du type de document
                typeDocSelect1.appendChild(option1);
            });
        })
        .catch(error => console.error('Erreur:', error));
    // Ajoute un event listener sur le select pour filtrer les documents
    document.getElementById('typeDocSelect').addEventListener('change', function() {
        fetchDocuments(this.value); // Appelle fetchDocuments avec la valeur sélectionnée
    });
});

// Fonction pour afficher les documents
function fetchDocuments(filterType = 'All') {
    fetch('http://localhost:5000/docs')
    .then(response => response.json())
    .then(documents => {
        const tableBody = document.getElementById('documents-table-body');
        tableBody.innerHTML = ''; // Clear existing rows
        documents.forEach(doc => {
            if (filterType === 'All' || doc.libelle_type_doc === filterType) {
                // Création d'une nouvelle ligne pour chaque document qui correspond au filtre
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${doc.id_doc}</td>
                    <td>${doc.nom} ${doc.prenom}</td>
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
            }
        });
    })
    .catch(error => console.error('Erreur:', error));
}

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
    const nomTypeDoc = document.getElementById('typeDocSelect1').value.trim();
    const libelledoc = document.getElementById('libelledoc').value.trim();
    const nomDoc = document.getElementById('nomdoc').files[0];

    let formValid = true;

    if (nomTypeDoc === "") {
        showError(typeDocError, 'Veuillez sélectionner un type de document.');
        formValid = false;
    }
    if (libelledoc === "") {
        showError(libelleDocError, 'Veuillez entrer un libellé.');
        formValid = false;
    }
    if (!nomDoc) {
        showError(nomDocError, 'Veuillez sélectionner un fichier.');
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
        const response = await fetch('http://localhost:5000/docs', { 
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
