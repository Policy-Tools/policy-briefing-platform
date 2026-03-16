
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
    var homepageSplashVideo = homepageSplash ? homepageSplash.querySelector("[data-splash-video]") : null;
    var menuOverlay = document.querySelector("[data-site-menu]");
    var menuToggles = document.querySelectorAll("[data-menu-toggle]");
    var menuClose = document.querySelector("[data-menu-close]");
    var dashboardToggle = document.querySelector("[data-dashboard-toggle]");
    var dashboardLayer = document.querySelector("[data-home-dashboard]");
    var dashboardClose = document.querySelector("[data-dashboard-close]");
    var dashboardBackdrop = document.querySelector("[data-home-dashboard-backdrop]");
    var dashboardExpand = document.querySelector("[data-dashboard-expand]");
    var homepageShell = document.querySelector(".homepage-shell");
    var horizontalSections = document.querySelectorAll("[data-horizontal-section]");
    var hotTopicsRotator = document.querySelector("[data-hot-topics-rotator]");
    var hotTopicSlides = hotTopicsRotator ? hotTopicsRotator.querySelectorAll("[data-hot-topic-slide]") : [];
    var hotTopicDots = hotTopicsRotator ? hotTopicsRotator.querySelectorAll("[data-hot-topic-dot]") : [];
    var policyLibrary = document.querySelector("[data-policy-library]");
    var libraryItems = policyLibrary ? Array.prototype.slice.call(policyLibrary.querySelectorAll("[data-library-item]")) : [];
    var libraryFilterButtons = policyLibrary ? policyLibrary.querySelectorAll("[data-filter-type]") : [];
    var libraryClear = policyLibrary ? policyLibrary.querySelector("[data-library-clear]") : null;
    var libraryResults = policyLibrary ? policyLibrary.querySelector("[data-library-results]") : null;
    var libraryActiveFilters = policyLibrary ? policyLibrary.querySelector("[data-library-active-filters]") : null;
    var libraryEmpty = policyLibrary ? policyLibrary.querySelector("[data-library-empty]") : null;
    var libraryPagination = policyLibrary ? policyLibrary.querySelector("[data-library-pagination]") : null;
    var libraryPages = policyLibrary ? policyLibrary.querySelector("[data-library-pages]") : null;
    var libraryPrev = policyLibrary ? policyLibrary.querySelector('[data-library-nav="prev"]') : null;
    var libraryNext = policyLibrary ? policyLibrary.querySelector('[data-library-nav="next"]') : null;
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

    function playInlineVideo(video) {
        if (!video) {
            return;
        }

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
    }

    function syncBackgroundVideoPlayback() {
        if (!backgroundVideos.length) {
            return;
        }

        backgroundVideos.forEach(function (video) {
            playInlineVideo(video);
        });
    }

    function setHomepageSplashState(isHidden) {
        if (!homepageSplash) {
            return;
        }

        document.documentElement.classList.toggle("homepage-splash-seen", isHidden);
        homepageSplash.classList.toggle("is-hidden", isHidden);

        if (!homepageSplashVideo) {
            return;
        }

        if (isHidden) {
            homepageSplashVideo.pause();
            return;
        }

        playInlineVideo(homepageSplashVideo);
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

    if (homepageSplashVideo) {
        homepageSplashVideo.addEventListener("loadeddata", function () {
            if (!homepageSplash || homepageSplash.classList.contains("is-hidden")) {
                return;
            }

            playInlineVideo(homepageSplashVideo);
        }, { once: true });
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
        var splashDisplayDuration = 6500;
        var hasSeenSplash = false;

        try {
            hasSeenSplash = window.sessionStorage.getItem(splashSessionKey) === "true";
        } catch (error) {
            hasSeenSplash = false;
        }

        if (hasSeenSplash) {
            setHomepageSplashState(true);
        } else {
            try {
                window.sessionStorage.setItem(splashSessionKey, "true");
            } catch (error) {
                // Ignore storage failures and fall back to showing the splash next time.
            }

            setHomepageSplashState(false);

            window.setTimeout(function () {
                setHomepageSplashState(true);
            }, splashDisplayDuration);
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

        setHotTopic(hotTopicIndex);

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

    if (policyLibrary && libraryItems.length) {
        var activeLibraryFilters = {
            ministry: "all",
            sector: "all",
            layer: "all"
        };
        var currentLibraryPage = 1;
        var currentLibraryPageSize = getLibraryPageSize();

        function getLibraryPageSize() {
            if (window.innerWidth <= 720) {
                return 3;
            }

            if (window.innerWidth <= 1024) {
                return 4;
            }

            return 6;
        }

        function getFilterButtonLabel(filterType, filterValue) {
            var matchingButton = policyLibrary.querySelector('[data-filter-type="' + filterType + '"][data-filter-value="' + filterValue + '"]');

            return matchingButton ? matchingButton.textContent : filterValue;
        }

        function syncLibraryFilterButtons() {
            libraryFilterButtons.forEach(function (button) {
                var filterType = button.getAttribute("data-filter-type");
                var filterValue = button.getAttribute("data-filter-value");
                var isActive = activeLibraryFilters[filterType] === filterValue;

                button.classList.toggle("is-active", isActive);
                button.setAttribute("aria-pressed", isActive ? "true" : "false");
            });

            if (libraryClear) {
                var hasActiveFilter = activeLibraryFilters.ministry !== "all" || activeLibraryFilters.sector !== "all" || activeLibraryFilters.layer !== "all";
                libraryClear.disabled = !hasActiveFilter;
            }
        }

        function renderActiveLibraryFilters() {
            if (!libraryActiveFilters) {
                return;
            }

            libraryActiveFilters.innerHTML = "";

            if (activeLibraryFilters.ministry === "all" && activeLibraryFilters.sector === "all" && activeLibraryFilters.layer === "all") {
                var defaultChip = document.createElement("span");
                defaultChip.className = "policy-active-chip";
                defaultChip.textContent = "Alle ministeries, sectoren en lagen";
                libraryActiveFilters.appendChild(defaultChip);
                return;
            }

            ["ministry", "sector", "layer"].forEach(function (filterType) {
                var filterValue = activeLibraryFilters[filterType];
                var chip;

                if (filterValue === "all") {
                    return;
                }

                chip = document.createElement("span");
                chip.className = "policy-active-chip";
                chip.textContent = getFilterButtonLabel(filterType, filterValue);
                libraryActiveFilters.appendChild(chip);
            });
        }

        function getFilteredLibraryItems() {
            return libraryItems.filter(function (item) {
                return Object.keys(activeLibraryFilters).every(function (filterType) {
                    var activeValue = activeLibraryFilters[filterType];

                    if (activeValue === "all") {
                        return true;
                    }

                    return item.getAttribute("data-" + filterType) === activeValue;
                });
            });
        }

        function renderLibraryPagination(pageCount) {
            var pageNumber;
            var button;

            if (!libraryPagination || !libraryPages) {
                return;
            }

            libraryPages.innerHTML = "";
            libraryPagination.hidden = pageCount <= 1;

            if (libraryPrev) {
                libraryPrev.disabled = currentLibraryPage <= 1;
            }

            if (libraryNext) {
                libraryNext.disabled = currentLibraryPage >= pageCount;
            }

            for (pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
                button = document.createElement("button");
                button.type = "button";
                button.className = "policy-page-button";
                button.textContent = String(pageNumber);
                button.setAttribute("data-library-page", String(pageNumber));
                button.setAttribute("aria-label", "Ga naar pagina " + pageNumber);

                if (pageNumber === currentLibraryPage) {
                    button.classList.add("is-active");
                    button.setAttribute("aria-current", "page");
                }

                libraryPages.appendChild(button);
            }
        }

        function renderLibrary() {
            var filteredItems = getFilteredLibraryItems();
            var pageCount = Math.max(1, Math.ceil(filteredItems.length / currentLibraryPageSize));
            var startIndex;
            var endIndex;
            var visibleItems;

            currentLibraryPage = Math.min(currentLibraryPage, pageCount);
            startIndex = (currentLibraryPage - 1) * currentLibraryPageSize;
            endIndex = startIndex + currentLibraryPageSize;
            visibleItems = filteredItems.slice(startIndex, endIndex);

            libraryItems.forEach(function (item) {
                var shouldShow = visibleItems.indexOf(item) !== -1;

                item.hidden = !shouldShow;
                item.setAttribute("aria-hidden", shouldShow ? "false" : "true");
            });

            if (libraryResults) {
                if (!filteredItems.length) {
                    libraryResults.textContent = "Geen artikelen gevonden";
                } else {
                    libraryResults.textContent = "Toont " + (startIndex + 1) + "-" + (startIndex + visibleItems.length) + " van " + filteredItems.length + " artikelen";
                }
            }

            if (libraryEmpty) {
                libraryEmpty.hidden = filteredItems.length !== 0;
            }

            renderLibraryPagination(pageCount);
            renderActiveLibraryFilters();
            syncLibraryFilterButtons();
        }

        libraryFilterButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var filterType = button.getAttribute("data-filter-type");
                var filterValue = button.getAttribute("data-filter-value");

                activeLibraryFilters[filterType] = filterValue || "all";
                currentLibraryPage = 1;
                renderLibrary();
            });
        });

        if (libraryClear) {
            libraryClear.addEventListener("click", function () {
                activeLibraryFilters = {
                    ministry: "all",
                    sector: "all",
                    layer: "all"
                };
                currentLibraryPage = 1;
                renderLibrary();
            });
        }

        if (libraryPrev) {
            libraryPrev.addEventListener("click", function () {
                if (currentLibraryPage <= 1) {
                    return;
                }

                currentLibraryPage -= 1;
                renderLibrary();
            });
        }

        if (libraryNext) {
            libraryNext.addEventListener("click", function () {
                var filteredItems = getFilteredLibraryItems();
                var pageCount = Math.max(1, Math.ceil(filteredItems.length / currentLibraryPageSize));

                if (currentLibraryPage >= pageCount) {
                    return;
                }

                currentLibraryPage += 1;
                renderLibrary();
            });
        }

        if (libraryPages) {
            libraryPages.addEventListener("click", function (event) {
                var pageButton = event.target.closest("[data-library-page]");
                var nextPage;

                if (!pageButton) {
                    return;
                }

                nextPage = Number(pageButton.getAttribute("data-library-page"));

                if (!nextPage) {
                    return;
                }

                currentLibraryPage = nextPage;
                renderLibrary();
            });
        }

        window.addEventListener("resize", function () {
            var nextPageSize = getLibraryPageSize();

            if (nextPageSize === currentLibraryPageSize) {
                return;
            }

            currentLibraryPageSize = nextPageSize;
            currentLibraryPage = 1;
            renderLibrary();
        });

        renderLibrary();
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
        if (homepageShell) {
            homepageShell.addEventListener("scroll", scheduleHorizontalSectionsSync, { passive: true });
        } else {
            window.addEventListener("scroll", scheduleHorizontalSectionsSync, { passive: true });
        }
        window.addEventListener("resize", scheduleHorizontalSectionsSync);
    }
});
