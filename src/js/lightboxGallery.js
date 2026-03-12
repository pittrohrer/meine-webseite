document.addEventListener('DOMContentLoaded', () => {
    const galleryImages = document.querySelectorAll('.gallery img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox .close');

    // Prüfe, ob die Elemente existieren
    if (galleryImages.length > 0 && lightbox && lightboxImg && closeBtn) {
        galleryImages.forEach(image => {
            image.addEventListener('click', () => {
                lightbox.style.display = 'flex';
                lightboxImg.src = image.src;
            });
        });

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }
});