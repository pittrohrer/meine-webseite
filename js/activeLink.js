document.addEventListener("DOMContentLoaded", function () {
    // Verzögere den Zugriff auf die Navigation, um sicherzustellen, dass der Header geladen ist
    setTimeout(function() {
        // Holen des aktuellen Pfads
        const currentPath = window.location.pathname;
        console.log("Aktueller Pfad:", currentPath);

        // Extrahiere nur den Dateinamen (letzter Teil des Pfads)
        const fileName = currentPath.split('/').pop();
        console.log("Dateiname:", fileName);

        // Alle Links in der Navigation
        const navLinks = document.querySelectorAll('#nav-menu a');
        console.log("Liste der Navigationslinks:");

        navLinks.forEach(link => {
            console.log(link.getAttribute('href'));
        });

        // Vergleiche jeden Link mit dem extrahierten Dateinamen
        navLinks.forEach(link => {
            // Hier vergleichen wir nur den Dateinamen (der letzte Teil des Links) mit dem aktuellen Dateinamen
            if (link.getAttribute('href').split('/').pop() === fileName) {
                link.classList.add('active');
            }
        });
    }, 500); // Setze eine kleine Verzögerung (500ms), damit der Header geladen ist
});
