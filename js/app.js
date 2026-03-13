
document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    var modeHeadline = document.getElementById("mode-headline");
    var modeDescription = document.getElementById("mode-description");
    var feedPanel = document.querySelector("[data-feed-panel]");
    var feedToggle = document.querySelector("[data-feed-toggle]");
    var feedClose = document.querySelector("[data-feed-close]");
    var homepageSplash = document.querySelector("[data-homepage-splash]");
    var menuOverlay = document.querySelector("[data-site-menu]");
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var menuClose = document.querySelector("[data-menu-close]");
    var horizontalSections = document.querySelectorAll("[data-horizontal-section]");

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

        if (feedPanel) {
            feedPanel.setAttribute("aria-hidden", "true");
        }
    }

    if (feedToggle && feedPanel) {
        feedToggle.addEventListener("click", function () {
            var isHidden = feedPanel.getAttribute("aria-hidden") === "true";
            feedPanel.setAttribute("aria-hidden", isHidden ? "false" : "true");
        });
    }

    if (feedClose && feedPanel) {
        feedClose.addEventListener("click", function () {
            feedPanel.setAttribute("aria-hidden", "true");
        });
    }

    if (modeHeadline || modeDescription || feedToggle) {
        syncHomepageState();
    }

    if (homepageSplash) {
        window.setTimeout(function () {
            homepageSplash.classList.add("is-hidden");
        }, 1600);
    }

    function setMenuState(isOpen) {
        if (!menuOverlay || !menuToggle) {
            return;
        }

        menuOverlay.classList.toggle("is-open", isOpen);
        menuOverlay.setAttribute("aria-hidden", isOpen ? "false" : "true");
        menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        body.classList.toggle("menu-open", isOpen);
    }

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener("click", function () {
            var isOpen = menuOverlay.getAttribute("aria-hidden") === "false";
            setMenuState(!isOpen);
        });
    }

    if (menuClose) {
        menuClose.addEventListener("click", function () {
            setMenuState(false);
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener("click", function (event) {
            if (event.target === menuOverlay) {
                setMenuState(false);
            }
        });
    }

    function syncHorizontalSections() {
        if (!horizontalSections.length) {
            return;
        }

        horizontalSections.forEach(function (section) {
            var track = section.querySelector("[data-horizontal-track]");
            var sticky = section.querySelector(".week-timeline-sticky");

            if (!track || !sticky) {
                return;
            }

            var overflow = Math.max(0, track.scrollWidth - section.clientWidth);
            var extraScroll = overflow + Math.round(window.innerHeight * 0.45);
            var totalScrollable = Math.max(1, extraScroll);
            var rect = section.getBoundingClientRect();
            var progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
            var translate = overflow * progress;

            section.style.height = window.innerHeight + extraScroll + "px";
            track.style.transform = "translate3d(" + -translate + "px, 0, 0)";
        });
    }

    if (horizontalSections.length) {
        syncHorizontalSections();
        window.addEventListener("scroll", syncHorizontalSections, { passive: true });
        window.addEventListener("resize", syncHorizontalSections);
    }
});
