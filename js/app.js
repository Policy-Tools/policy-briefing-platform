
document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    var modeButtons = document.querySelectorAll("[data-mode-target]");
    var modePanels = document.querySelectorAll("[data-mode-panel]");
    var modeHeadline = document.getElementById("mode-headline");
    var modeDescription = document.getElementById("mode-description");
    var sidebar = document.getElementById("personal-sidebar");
    var sidebarToggle = document.getElementById("sidebar-toggle");
    var sidebarClose = document.getElementById("sidebar-close");

    if (!modeButtons.length) {
        return;
    }

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

    function setMode(mode) {
        body.setAttribute("data-mode", mode);

        modeButtons.forEach(function (button) {
            var isActive = button.getAttribute("data-mode-target") === mode;
            button.classList.toggle("active", isActive);
        });

        modePanels.forEach(function (panel) {
            panel.hidden = panel.getAttribute("data-mode-panel") !== mode;
        });

        if (modeHeadline && modeDescription && modeCopy[mode]) {
            modeHeadline.textContent = modeCopy[mode].headline;
            modeDescription.textContent = modeCopy[mode].description;
        }

        if (sidebarToggle) {
            sidebarToggle.hidden = mode !== "logged-in";
        }

        if (sidebar) {
            sidebar.setAttribute("aria-hidden", "true");
        }
    }

    modeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            setMode(button.getAttribute("data-mode-target"));
        });
    });

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

    setMode(body.getAttribute("data-mode") || "logged-out");
});
