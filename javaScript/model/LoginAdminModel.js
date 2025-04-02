// Script permettant de gerer les champs du formulaire de connection
function loginAdminForm(event) {
    document.getElementById('loginAdmin').addEventListener('submit', async function(event) {
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
        const email = document.getElementById('emailAd').value.trim();
        const password = document.getElementById('passwordAd').value.trim();
        let formValid = true;
        hideError(document.getElementById('emailError'));
        hideError(document.getElementById('passwordError'));
        if (email === '') {
            showError(document.getElementById('emailError'), 'Email est incorrect');
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
                adresse_mail: formData.get('emailAd'),
                mot_de_passe: formData.get('passwordAd')
            };
            try {
                const response = await fetch('http://localhost:5000/loginAds', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(login),
                });
                const data = await response.json(); // Récupère les données une seule fois
                
                if (response.ok) {
                    if (data.redirectUrl) {
                        // Stocke l'ID de l'utilisateur dans localStorage avec une clé unique basée sur l'email
                        localStorage.setItem('storageKey', data.userId);
                        
                        // Redirige l'utilisateur vers la page appropriée
                        window.location.href = data.redirectUrl;
                    } else {
                        if (data.error) {
                            // Afficher les messages d'erreur
                            if (data.error === 'email') {
                                document.getElementById('emailError').style.display = 'block';
                            } else if (data.error === 'password') {
                                document.getElementById('passwordError').style.display = 'block';
                            } else {
                                console.error('Erreur non reconnue:', data.error);
                            }
                        } else {
                            console.error('Réponse inattendue du serveur.');
                        }
                    }
                } else {
                    console.error('Réponse du serveur non ok');
                }
            } catch (error) {
                console.error('Erreur lors de la requête:', error);
            }
        }
    });
}