document.addEventListener("DOMContentLoaded", function () {
    function initializeMenuToggle() {
        const menuToggle = document.getElementById("menu-toggle");

        if (!menuToggle) {
            console.log("menu-toggle existiert noch nicht. Warte auf Laden des Headers...");
            setTimeout(initializeMenuToggle, 100);
            return;
        }

        console.log("menu-toggle gefunden. Füge Event-Listener hinzu.");
        menuToggle.addEventListener("click", function() {
            const navMenu = document.getElementById("nav-menu");
            navMenu.classList.toggle("active");
            console.log("menu-toggle wurde geklickt. nav-menu Zustand:", navMenu.classList.contains("active") ? "aktiv" : "inaktiv");
        });
    }

    initializeMenuToggle();
});