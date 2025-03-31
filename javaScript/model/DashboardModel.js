// Récupérer et afficher le nombre total d'utilisateurs
fetch('http://localhost:5000/dashboards/count-users')
.then(response => response.json())
.then(data => {
    document.getElementById('totalUsers').innerText = data.totalUsers;
});

// Récupérer et afficher le nombre d'étudiants 
fetch('http://localhost:5000/dashboards/count-students')
.then(response => response.json())
.then(data => {
    document.getElementById('totalStudents').innerText = data.totalEtudiant;
});
    
// Récupérer et afficher le nombre total de document 
fetch('http://localhost:5000/dashboards/count-documents')
.then(response => response.json())
.then(data => {
    document.getElementById('totalDocuments').innerText = data.totalDocuments;
});

// Récupérer et afficher le nombre de filière
fetch('http://localhost:5000/dashboards/count-filiere')
.then(response => response.json())
.then(data => {
    document.getElementById('totalfiliere').innerText = data.totalFiliere;
});

// Récupérer et afficher le nombre de faculter
fetch('http://localhost:5000/dashboards/count-faculter')
.then(response => response.json())
.then(data => {
    document.getElementById('totalfaculter').innerText = data.totalFaculter;
});


//code pour le graphique
document.addEventListener("DOMContentLoaded", function () {
    // Sélectionner le canvas
    const ctx = document.getElementById('myChart').getContext('2d');

    // Fonction pour récupérer les données du dashboard
    function getDashboardData() {
        return {
            totalUsers: parseInt(document.getElementById("totalUsers").textContent) || 0,
            totalStudents: parseInt(document.getElementById("totalStudents").textContent) || 0,
            totalDocuments: parseInt(document.getElementById("totalDocuments").textContent) || 0,
            totalFiliere: parseInt(document.getElementById("totalfiliere").textContent) || 0,
            totalFaculter: parseInt(document.getElementById("totalfaculter").textContent) || 0
        };
    }

    // Fonction pour mettre à jour le graphique dynamiquement
    function updateChart(chart) {
        const data = getDashboardData();
        chart.data.datasets[0].data = [
            data.totalUsers,
            data.totalStudents,
            data.totalDocuments,
            data.totalFiliere,
            data.totalFaculter
        ];
        chart.update();
    }

    // Initialisation du graphique avec des valeurs par défaut
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Utilisateurs', 'Étudiants', 'Documents', 'Filières', 'Facultés'],
            datasets: [{
                label: 'Statistiques du Dashboard',
                data: [0, 0, 0, 0, 0], // Valeurs par défaut
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Mettre à jour le graphique après chargement des données du dashboard
    setTimeout(() => updateChart(myChart), 1000); // Délai pour s'assurer que les données sont chargées
});