
document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    var modeHeadline = document.getElementById("mode-headline");
    var modeDescription = document.getElementById("mode-description");
    var sidebar = document.getElementById("personal-sidebar");
    var sidebarToggle = document.getElementById("sidebar-toggle");
    var sidebarClose = document.getElementById("sidebar-close");

    var modeCopy = {
        "logged-out": {
            headline: "Algemene nieuwsstroom en beleidsupdates",
            description: "De homepage toont brede ontwikkelingen voor iedere bezoeker, zonder persoonlijke rangschikking."
        },
        "logged-in": {
            headline: "Persoonlijke feed met snelle acties",
            description: "Ingelogde gebruikers krijgen een rustige homepage met een verborgen zijbalk voor filters, persoonlijke signalen en briefingacties."
        }
    };

    function syncHomepageState() {
        var authState = body.getAttribute("data-auth") || "logged-out";

        if (modeHeadline && modeDescription && modeCopy[authState]) {
            modeHeadline.textContent = modeCopy[authState].headline;
            modeDescription.textContent = modeCopy[authState].description;
        }

        if (sidebarToggle) {
            sidebarToggle.hidden = authState !== "logged-in";
        }

        if (sidebar) {
            sidebar.setAttribute("aria-hidden", "true");
        }
    }

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener("click", function () {
            sidebar.setAttribute("aria-hidden", "false");
        });
    }

    if (sidebarClose && sidebar) {
        sidebarClose.addEventListener("click", function () {
            sidebar.setAttribute("aria-hidden", "true");
        });
    }

    if (modeHeadline || modeDescription || sidebarToggle) {
        syncHomepageState();
    }
});
