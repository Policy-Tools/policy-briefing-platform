
document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    var backgroundVideos = document.querySelectorAll("[data-background-video]");
    var authStorageKey = "policy-auth-state";
    var modeHeadline = document.getElementById("mode-headline");
    var modeDescription = document.getElementById("mode-description");
    var feedPanel = document.querySelector("[data-feed-panel]");
    var feedToggle = document.querySelector("[data-feed-toggle]");
    var feedClose = document.querySelector("[data-feed-close]");
    var homepageSplash = document.querySelector("[data-homepage-splash]");
    var menuOverlay = document.querySelector("[data-site-menu]");
    var menuToggles = document.querySelectorAll("[data-menu-toggle]");
    var menuClose = document.querySelector("[data-menu-close]");
    var dashboardToggle = document.querySelector("[data-dashboard-toggle]");
    var dashboardLayer = document.querySelector("[data-home-dashboard]");
    var dashboardClose = document.querySelector("[data-dashboard-close]");
    var dashboardBackdrop = document.querySelector("[data-home-dashboard-backdrop]");
    var dashboardExpand = document.querySelector("[data-dashboard-expand]");
    var horizontalSections = document.querySelectorAll("[data-horizontal-section]");
    var hotTopicsRotator = document.querySelector("[data-hot-topics-rotator]");
    var hotTopicSlides = hotTopicsRotator ? hotTopicsRotator.querySelectorAll("[data-hot-topic-slide]") : [];
    var hotTopicDots = hotTopicsRotator ? hotTopicsRotator.querySelectorAll("[data-hot-topic-dot]") : [];
    var authSetters = document.querySelectorAll("[data-auth-set]");

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

    function persistAuthState(authState) {
        try {
            window.localStorage.setItem(authStorageKey, authState);
        } catch (error) {
            // Ignore storage failures and continue with the in-memory state.
        }
    }

    function applyAuthState(authState) {
        body.setAttribute("data-auth", authState);
    }

    function readAuthState() {
        try {
            return window.localStorage.getItem(authStorageKey);
        } catch (error) {
            return null;
        }
    }

    function syncBackgroundVideoPlayback() {
        if (!backgroundVideos.length) {
            return;
        }

        backgroundVideos.forEach(function (video) {
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;

            if (video.readyState < 2 || !video.paused) {
                return;
            }

            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    // Ignore autoplay promise rejections and leave the browser in control.
                });
            }
        });
    }

    function syncHomepageState() {
        var authState = body.getAttribute("data-auth") || "logged-out";

        if (modeHeadline && modeDescription && modeCopy[authState]) {
            modeHeadline.textContent = modeCopy[authState].headline;
            modeDescription.textContent = modeCopy[authState].description;
        }

        if (dashboardLayer && authState !== "logged-in") {
            setDashboardState(false);
        }
    }

    var storedAuthState = readAuthState();

    if (storedAuthState === "logged-in" || storedAuthState === "logged-out") {
        applyAuthState(storedAuthState);
    }

    if (backgroundVideos.length) {
        backgroundVideos.forEach(function (video) {
            video.addEventListener("loadeddata", syncBackgroundVideoPlayback, { once: true });
        });

        syncBackgroundVideoPlayback();
        window.addEventListener("pageshow", syncBackgroundVideoPlayback);
        document.addEventListener("visibilitychange", function () {
            if (!document.hidden) {
                syncBackgroundVideoPlayback();
            }
        });
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
        var splashSessionKey = "homepage-splash-seen";
        var hasSeenSplash = false;

        try {
            hasSeenSplash = window.sessionStorage.getItem(splashSessionKey) === "true";
        } catch (error) {
            hasSeenSplash = false;
        }

        if (hasSeenSplash) {
            homepageSplash.classList.add("is-hidden");
        } else {
            window.setTimeout(function () {
                homepageSplash.classList.add("is-hidden");

                try {
                    window.sessionStorage.setItem(splashSessionKey, "true");
                } catch (error) {
                    // Ignore storage failures and fall back to showing the splash next time.
                }
            }, 1600);
        }
    }

    function setMenuState(isOpen) {
        if (!menuOverlay || !menuToggles.length) {
            return;
        }

        menuOverlay.classList.toggle("is-open", isOpen);
        menuOverlay.setAttribute("aria-hidden", isOpen ? "false" : "true");
        menuToggles.forEach(function (toggle) {
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
        body.classList.toggle("menu-open", isOpen);
    }

    if (menuToggles.length && menuOverlay) {
        menuToggles.forEach(function (toggle) {
            toggle.addEventListener("click", function () {
                var isOpen = menuOverlay.getAttribute("aria-hidden") === "false";
                setMenuState(!isOpen);
            });
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

    function setDashboardState(isOpen) {
        if (!dashboardLayer || !dashboardToggle) {
            return;
        }

        if ((body.getAttribute("data-auth") || "logged-out") !== "logged-in") {
            isOpen = false;
        }

        dashboardLayer.setAttribute("aria-hidden", isOpen ? "false" : "true");
        dashboardToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        body.classList.toggle("dashboard-open", isOpen);

        if (!isOpen) {
            body.classList.remove("dashboard-expanded");
        }
    }

    if (dashboardToggle && dashboardLayer) {
        dashboardToggle.addEventListener("click", function () {
            var isOpen = dashboardLayer.getAttribute("aria-hidden") === "false";
            setDashboardState(!isOpen);
        });
    }

    if (dashboardClose) {
        dashboardClose.addEventListener("click", function () {
            setDashboardState(false);
        });
    }

    if (dashboardBackdrop) {
        dashboardBackdrop.addEventListener("click", function () {
            setDashboardState(false);
        });
    }

    if (dashboardExpand && dashboardLayer) {
        dashboardExpand.addEventListener("click", function () {
            setDashboardState(true);
            body.classList.add("dashboard-expanded");
        });
    }

    if (authSetters.length) {
        authSetters.forEach(function (element) {
            element.addEventListener("click", function () {
                var nextState = element.getAttribute("data-auth-set");

                if (!nextState) {
                    return;
                }

                applyAuthState(nextState);
                persistAuthState(nextState);
            });
        });
    }

    if (hotTopicsRotator && hotTopicSlides.length > 1) {
        var hotTopicIndex = 0;
        var hotTopicTimer = null;
        var hotTopicIntervalMs = 5200;

        function setHotTopic(index) {
            hotTopicIndex = index;

            hotTopicSlides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });

            hotTopicDots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
                dot.setAttribute("aria-pressed", dotIndex === index ? "true" : "false");
            });
        }

        function startHotTopicRotation() {
            if (hotTopicTimer) {
                window.clearInterval(hotTopicTimer);
            }

            hotTopicTimer = window.setInterval(function () {
                setHotTopic((hotTopicIndex + 1) % hotTopicSlides.length);
            }, hotTopicIntervalMs);
        }

        hotTopicDots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                setHotTopic(dotIndex);
                startHotTopicRotation();
            });
        });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                if (hotTopicTimer) {
                    window.clearInterval(hotTopicTimer);
                    hotTopicTimer = null;
                }
            } else {
                startHotTopicRotation();
            }
        });

        setHotTopic(0);
        startHotTopicRotation();
    }

    var horizontalSyncFrame = null;

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
            var nextHeight = window.innerHeight + extraScroll + "px";
            var nextTransform = "translate3d(" + -translate + "px, 0, 0)";

            if (section.style.height !== nextHeight) {
                section.style.height = nextHeight;
            }

            if (track.style.transform !== nextTransform) {
                track.style.transform = nextTransform;
            }
        });
    }

    function scheduleHorizontalSectionsSync() {
        if (horizontalSyncFrame !== null) {
            return;
        }

        horizontalSyncFrame = window.requestAnimationFrame(function () {
            horizontalSyncFrame = null;
            syncHorizontalSections();
        });
    }

    if (horizontalSections.length) {
        syncHorizontalSections();
        window.addEventListener("scroll", scheduleHorizontalSectionsSync, { passive: true });
        window.addEventListener("resize", scheduleHorizontalSectionsSync);
    }
});
