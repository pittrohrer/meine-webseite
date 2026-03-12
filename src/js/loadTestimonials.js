// JWT Token für die Authentifizierung
import { jwtToken } from './constants.js';

document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://web-modules.dev/api/v1/testimonials';
    const LIKE_API_URL = 'https://web-modules.dev/api/v1/like';

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = lightbox.querySelector('.close');

    // Schließt die Lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Funktion zum Anzeigen eines Bildes in der Lightbox
    function showLightbox(imageSrc, altText) {
        lightboxImg.src = imageSrc;
        lightboxImg.alt = altText;
        lightbox.style.display = 'block';
    }

    // Testimonials aus der API laden
    fetch(API_URL, {
        headers: {
            Authorization: jwtToken
        }
    })
        .then(async response => {
            if (!response.ok) {
                // Fehlermeldung aus der Antwort extrahieren
                const errorResponse = await response.json();
                const errorMessage = errorResponse.message || `Fehler: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }
            return response.json();
        })
        .then(data => {
            console.log('Daten von der API:', data); // Debug: Datenstruktur prüfen
            if (data.testimonials && Array.isArray(data.testimonials)) {
                loadTestimonials(data.testimonials); // Testimonials laden
            } else {
                throw new Error('Unerwartetes Datenformat');
            }
        })
        .catch(error => {
            displayErrorMessage(error.message);
            console.error('Fehler beim Laden der Testimonial-Daten:', error);
        });

    // Testimonials laden und mit Lightbox-Funktionalität versehen
    function loadTestimonials(testimonials) {
        const testimonialsContainer = document.querySelector('.testimonial-container');
        testimonialsContainer.innerHTML = ''; // Container leeren, bevor neue Testimonials geladen werden

        testimonials.forEach(testimonial => {
            const testimonialElement = document.createElement('div');
            testimonialElement.classList.add('testimonial');

            // Avatar
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = testimonial.avatar;
            img.alt = `${testimonial.firstname} ${testimonial.lastname}`;
            img.classList.add('testimonial-avatar');
            figure.appendChild(img);

            img.addEventListener('click', () => {
                showLightbox(img.src, img.alt); // Großbild-Popup öffnen
            });

            // Name
            const name = document.createElement('p');
            name.classList.add('testimonial-name');
            name.textContent = `${testimonial.firstname} ${testimonial.lastname}`;

            // Company
            const company = document.createElement('p');
            company.classList.add('testimonial-company');
            company.textContent = testimonial.company;

            // Quote
            const quote = document.createElement('blockquote');
            quote.classList.add('testimonial-quote');
            quote.textContent = `"${testimonial.quote}"`;

            // Like Section
            const likeContainer = document.createElement('section');
            likeContainer.classList.add('like-container');

            const likeButton = document.createElement('button');
            likeButton.classList.add('like-button');
            likeButton.textContent = 'Like';

            const likesCount = document.createElement('span');
            likesCount.classList.add('likes');
            likesCount.textContent = `${testimonial.likes_count || 0} Likes`;

            // Event Listener für Like-Button
            likeButton.addEventListener('click', () => {
                likeTestimonial(testimonial.id, 'testimonial', likesCount);
            });

            likeContainer.appendChild(likeButton);
            likeContainer.appendChild(likesCount);

            // Zusammenstellen des Testimonial-Elements
            testimonialElement.appendChild(figure);
            testimonialElement.appendChild(name);
            testimonialElement.appendChild(company);
            testimonialElement.appendChild(quote);
            testimonialElement.appendChild(likeContainer);

            // Testimonial-Element zum Container hinzufügen
            testimonialsContainer.appendChild(testimonialElement);
        });
    }

    function likeTestimonial(id, type, likesCountElement) {
        fetch(LIKE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: jwtToken
            },
            body: JSON.stringify({
                type: type,
                id: id
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.amount !== undefined) {
                    likesCountElement.textContent = `${data.amount} Likes`;
                } else {
                    throw new Error('Fehler beim Liken: Keine Antwort erhalten');
                }
            })
            .catch(error => {
                displayErrorMessage(error.message);
                console.error('Fehler beim Liken:', error);
            });
    }

    // Funktion zur Anzeige einer Fehlermeldung
    function displayErrorMessage(message) {
        const testimonialsContainer = document.querySelector('.testimonial-container');
        testimonialsContainer.innerHTML = `<p class="error-message">Es ist ein Fehler aufgetreten.<br> Fehlermeldung: ${message}</p>`;
    }
});
