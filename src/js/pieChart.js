// JWT Token für die Authentifizierung
import { jwtToken } from './constants.js';

document.addEventListener("DOMContentLoaded", function () {

    // Globale Variablen zum Speichern der Chart-Instanzen
    let designChart = null;
    let componentsChart = null;

    // Globale Funktion zum Laden der Feedbackdaten
    window.loadFeedbackStats = function () {
        fetch('https://web-modules.dev/api/v1/feedback', {
            method: 'GET',
            headers: {
                'Authorization': `${jwtToken}`,
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Fehler beim Abrufen der Feedbackdaten.");
                }
                return response.json();
            })
            .then(data => {
                const feedbacks = data.feedbacks;

                // Arrays für Bewertungen initialisieren
                const designRatings = Array(10).fill(0);
                const componentRatings = Array(10).fill(0);

                feedbacks.forEach(feedback => {
                    const designRating = feedback.rating_design;
                    const componentRating = feedback.rating_components;

                    if (designRating >= 1 && designRating <= 10) {
                        designRatings[designRating - 1] += 1;
                    }
                    if (componentRating >= 1 && componentRating <= 10) {
                        componentRatings[componentRating - 1] += 1;
                    }
                });

                // Design-Diagramm aktualisieren oder erstellen
                const designCtx = document.getElementById("designChart").getContext("2d");
                if (designChart) {
                    designChart.data.datasets[0].data = designRatings;
                    designChart.update();
                } else {
                    designChart = new Chart(designCtx, {
                        type: 'pie',
                        data: {
                            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                            datasets: [{
                                label: 'Design Ratings',
                                data: designRatings,
                                backgroundColor: [
                                    'red', 'brown', 'orange', 'yellow',
                                    'beige', 'lightblue', 'darkblue', 'lightgreen',
                                    'olivedrab', 'green'
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Bewertungen des Designs',
                                    font: {
                                        size: 20
                                    }
                                }
                            }
                        }
                    });
                }

                // Komponenten-Diagramm aktualisieren oder erstellen
                const componentsCtx = document.getElementById("componentsChart").getContext("2d");
                if (componentsChart) {
                    componentsChart.data.datasets[0].data = componentRatings;
                    componentsChart.update();
                } else {
                    componentsChart = new Chart(componentsCtx, {
                        type: 'pie',
                        data: {
                            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                            datasets: [{
                                label: 'Component Ratings',
                                data: componentRatings,
                                backgroundColor: [
                                    'red', 'brown', 'orange', 'yellow',
                                    'beige', 'lightblue', 'darkblue', 'lightgreen',
                                    'olivedrab', 'green'
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Bewertungen der Komponenten',
                                    font: {
                                        size: 20
                                    }
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Fehler beim Laden der Feedbackdaten:", error);
            });
    };

    // Initialer Aufruf der Funktion, wenn das Dokument geladen ist
    loadFeedbackStats();
});
