// Script permettant de gerer les champs du formulaire de connection
function loginEtudiantForm(event) {
    document.getElementById('loginEtudiant').addEventListener('submit', async function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire
        // Fonction pour afficher un message d'erreur
        function showError(element, message) {
            element.style.display = 'block';
            element.textContent = message;
        }
        // Fonction pour cacher un message d'erreur
        function hideError(element) {
            element.style.display = 'none';
        }
        const email = document.getElementById('emailEtud').value.trim();
        const password = document.getElementById('passwordEtud').value.trim();
        let formValid = true;
        hideError(document.getElementById('emailError'));
        hideError(document.getElementById('passwordError'));
        if (email === '') {
            showError(document.getElementById('emailError'), 'Email ne doit pas être vide');
            formValid = false;
        }
        if (password === '') {
            showError(document.getElementById('passwordError'), `Password ne doit pas être vide`);
            formValid = false;
        }
        if (formValid) {
            const formData = new FormData(event.target);
            // Récupération des données du formulaire
            const login = {
                adresse_mail: formData.get('emailEtud'),
                mot_de_passe: formData.get('passwordEtud')
            };
            try {
                const response = await fetch('http://localhost:5000/loginEtuds', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(login),
                });
                const data = await response.json(); // Récupère les données une seule fois
                
                if (data.success) {
                    localStorage.setItem('storageKey', data.userId);
                    window.location.href = data.redirectUrl;
                } else {
                    if (data.error === 'email') {
                        showError(document.getElementById('emailError'), 'Email incorrect');
                    } else if (data.error === 'password') {
                        showError(document.getElementById('passwordError'), 'Mot de passe incorrect');
                    } else {
                        console.error('Erreur inconnue:', data.error);
                    }
                }        
            } catch (error) {
                console.error('Erreur lors de la requête:', error);
            }
        }
    });
}