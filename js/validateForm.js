// JWT Token für die Authentifizierung
import { jwtToken } from './constants.js';

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    // Validierungsfelder für das Formular
    const fields = [
        { id: "name", min: 3, max: 100 },
        { id: "email", pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, max: 200 },
        { id: "rating-design", required: true },
        { id: "rating-components", required: true },
    ];
    const messageField = document.getElementById("message");
    const messageCounter = document.getElementById("message-counter");

    // Zeichenlänge der Nachricht live anzeigen
    messageField.addEventListener("input", () => {
        messageCounter.textContent = `${messageField.value.length}/100 Zeichen`;
    });

    // Validierung bei Verlassen eines Feldes
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        input.addEventListener("blur", () => validateField(field));
    });

    // Validierung beim Absenden des Formulars
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Verhindert die Standardformularübermittlung

        let isValid = true;
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Wenn das Formular ungültig ist, wird die Submission verhindert
        if (!isValid) {
            return;
        }

        // Feedback-Daten sammeln
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            rating_design: document.getElementById("rating-design").value,
            rating_components: document.getElementById("rating-components").value,
            // Sicherstellen, dass der Kommentar als leerer String übermittelt wird, wenn kein Kommentar eingegeben wurde
            comment: document.getElementById("message").value.trim() || "No comment", // Falls leer, wird ein leerer String übermittelt
        };

        // Überprüfen, ob alle erforderlichen Felder ausgefüllt sind
        if (!formData.name || !formData.email || !formData.rating_design || !formData.rating_components) {
            alert("Bitte fülle alle erforderlichen Felder aus.");
            return;
        }

        // POST-Anfrage senden
        fetch('https://web-modules.dev/api/v1/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || "Fehler beim Senden des Feedbacks");
                    });
                }
                return response.json();
            })
            .then(data => {
                // Erfolgreiche Antwort
                createNotification("Feedback erfolgreich gesendet!", "success");
                console.log(data); // Ausgabe der Serverantwort

                // Formular zurücksetzen, um Felder zu leeren
                form.reset();
                // Manuell auch den Zähler für die Nachricht zurücksetzen
                messageCounter.textContent = "0/100 Zeichen";

                // Diagramme aktualisieren
                window.loadFeedbackStats();  // Hier wird die Funktion aufgerufen
            })
            .catch(error => {
                // Fehlerbehandlung
                console.error('Fehler beim Senden des Feedbacks:', error);
                alert("Es gab einen Fehler beim Senden deines Feedbacks.");
            });
    });

    // Funktion zum Erstellen von Benachrichtigungen
    function createNotification(message, type) {
        const notification = document.createElement("section");
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Benachrichtigung zum DOM hinzufügen
        document.body.appendChild(notification);

        // Benachrichtigung nach 4 Sekunden entfernen
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Validierungsfunktion
    function validateField({ id, min, max, pattern, required }) {
        const input = document.getElementById(id);
        const errorElement = document.getElementById(`${id}-error`);
        let errorMessage = "";

        if (required && input.value.trim() === "") {
            errorMessage = "Dieses Feld ist erforderlich.";
        } else if (min && input.value.length < min) {
            errorMessage = `Mindestlänge: ${min} Zeichen.`;
        } else if (max && input.value.length > max) {
            errorMessage = `Maximale Länge: ${max} Zeichen.`;
        } else if (pattern && !pattern.test(input.value)) {
            errorMessage = "Ungültiges Format.";
        }

        if (errorMessage) {
            errorElement.textContent = errorMessage;
            input.style.borderColor = "red";
            return false;
        } else {
            errorElement.textContent = "";
            input.style.borderColor = "green";
            return true;
        }
    }
});
