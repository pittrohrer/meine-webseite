// JWT Token für die Authentifizierung
import { jwtToken } from './constants.js';

document.addEventListener('DOMContentLoaded', function () {
    const API_URL = 'https://web-modules.dev/api/v1/products'; // API URL für Produkte
    const LIKE_API_URL = 'https://web-modules.dev/api/v1/like'; // API URL für Likes

    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = lightbox.querySelector('.close');

    // Lightbox schließen
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Produkte aus der API laden
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
            if (Array.isArray(data.products)) {
                const sortSelect = document.getElementById('sort-select'); // Sortierauswahl
                const selectedCriteria = sortSelect.value; // Aktuelles Kriterium auslesen

                // Produkte nach dem ausgewählten Kriterium sortieren
                const sortedProducts = sortProducts(data.products, selectedCriteria);

                // Sortierte Produkte laden
                loadProducts(sortedProducts);
            } else {
                throw new Error('Unerwartetes Datenformat');
            }
        })
        .catch(error => {
            displayErrorMessage(error.message);
            console.error('Fehler beim Laden der Produkt-Daten:', error);
        });


    // Funktion zum Sortieren der Produkte
    function sortProducts(products, criteria) {
        switch (criteria) {
            case 'price-asc':
                return products.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return products.sort((a, b) => b.price - a.price);
            default:
                return products;
        }
    }

    // Funktion zum Hinzufügen von Produkten zur Seite
    function loadProducts(products) {
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = ''; // Container leeren

        products.forEach(product => {
            const productElement = document.createElement('li');
            productElement.classList.add('product');

            // Artikel
            const article = document.createElement('article');

            // Produktname
            const productName = document.createElement('h3');
            productName.textContent = product.name;

            // Bild
            const figure = document.createElement('figure');
            const img = document.createElement('img');
            img.src = product.image;
            img.alt = product.name;
            img.classList.add('product-image');
            figure.appendChild(img);

            img.addEventListener('click', () => {
                openLightbox(product.image);
            });

            // SKU
            const sku = document.createElement('p');
            sku.innerHTML = `<strong>SKU:</strong> ${product.sku}`;

            // Preis
            const price = document.createElement('p');
            price.innerHTML = `<strong>Preis:</strong> ${product.price} CHF`;

            // Beschreibung
            const description = document.createElement('p');
            description.innerHTML = `<strong>Beschreibung:</strong> ${product.description || 'Keine Beschreibung verfügbar'}`;

            // Like-Bereich
            const likeContainer = document.createElement('section');
            likeContainer.classList.add('like-container');

            const likeButton = document.createElement('button');
            likeButton.classList.add('like-button');
            likeButton.textContent = 'Like';

            const likesCount = document.createElement('span');
            likesCount.classList.add('likes');
            likesCount.textContent = `${product.likes_count || 0} Likes`;

            // Event Listener für Like-Button
            likeButton.addEventListener('click', () => {
                likeProduct(product.id, 'product', likesCount);
            });

            likeContainer.appendChild(likeButton);
            likeContainer.appendChild(likesCount);

            // Artikel zusammenfügen
            article.appendChild(productName);
            article.appendChild(figure);
            article.appendChild(sku);
            article.appendChild(price);
            article.appendChild(description);
            article.appendChild(likeContainer);

            // Artikel zur Produktliste hinzufügen
            productElement.appendChild(article);
            productContainer.appendChild(productElement);
        });
    }

    function openLightbox(imageUrl) {
        lightboxImg.src = imageUrl;
        lightbox.style.display = 'flex';
    }

    // Funktion zum Liken eines Produkts
    function likeProduct(id, type, likesCountElement) {
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

    // Event-Listener für das Sortieren nach Preis
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', () => {
        const sortCriteria = sortSelect.value;

        fetch(API_URL, {
            headers: {
                Authorization: jwtToken
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.products)) {
                    const sortedProducts = sortProducts(data.products, sortCriteria);
                    loadProducts(sortedProducts);
                }
            })
            .catch(error => {
                console.error('Fehler beim Sortieren:', error);
            });
    });

    // Funktion zur Anzeige einer Fehlermeldung
    function displayErrorMessage(message) {
        const productContainer = document.getElementById('product-container');
        productContainer.innerHTML = `<p class="error-message">Es ist ein Fehler aufgetreten.<br> Fehlermeldung: ${message}</p>`;
    }
});