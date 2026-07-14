(function () {
    'use strict';

    function setReady(isReady) {
        document.body.classList.toggle('page-loading', !isReady);
        document.body.classList.toggle('page-ready', isReady);
        var loader = document.querySelector('.page-loader');
        if (loader) {
            loader.setAttribute('aria-busy', isReady ? 'false' : 'true');
        }
    }

    function iconClass(name) {
        return 'bi bi-' + name;
    }

    function renderProfile(site) {
        var root = document.getElementById('profile-root');
        if (!root) {
            return;
        }

        var contacts = site.contacts.map(function (item) {
            var rel = item.external ? ' rel="noopener noreferrer"' : '';
            var target = item.external ? ' target="_blank"' : '';
            return (
                '<li class="profile-contact">' +
                '<i class="' + iconClass(item.icon) + '" aria-hidden="true"></i>' +
                '<a href="' + item.href + '"' + target + rel + '>' + item.label + '</a>' +
                '</li>'
            );
        }).join('');

        var skills = site.skills.concat(site.skills).map(function (skill) {
            return '<span>' + skill + '</span>';
        }).join('');

        root.innerHTML =
            '<aside class="profile-panel">' +
            '<p class="profile-brand">' + site.brand + '</p>' +
            '<div class="profile-identity">' +
            '<div class="profile-photo-frame" aria-hidden="false">' +
            '<span class="profile-photo-ring" aria-hidden="true"></span>' +
            '<span class="profile-photo-orbit" aria-hidden="true"></span>' +
            '<span class="profile-photo-orbit profile-photo-orbit--lag" aria-hidden="true"></span>' +
            '<div class="profile-photo" style="background-image:url(\'' + site.photo + '\')" role="img" aria-label="' + site.photoAlt + '"></div>' +
            '</div>' +
            '<div class="profile-identity-text">' +
            '<h1 class="profile-name">' + site.name + '</h1>' +
            '<p class="profile-role">' + site.role + '</p>' +
            '</div>' +
            '</div>' +
            '<ul class="profile-contacts">' + contacts + '</ul>' +
            '<div class="skills-ticker" aria-label="Skills"><div class="skills-track">' + skills + '</div></div>' +
            '<blockquote class="profile-quote" id="random-quote">…</blockquote>' +
            '<a class="profile-thanks" href="' + site.thanksHref + '">' + site.thanksLabel + ' →</a>' +
            '</aside>';
    }

    function renderNav(site) {
        var nav = document.getElementById('site-nav');
        if (!nav) {
            return;
        }
        nav.innerHTML = site.nav.map(function (item, index) {
            var active = index === 0 ? ' is-active' : '';
            return '<a class="profile-nav-link' + active + '" href="' + item.href + '" data-nav="' + item.id + '">' + item.label + '</a>';
        }).join('');
    }

    function renderGroups(site) {
        var stream = document.getElementById('content-stream');
        if (!stream) {
            return;
        }

        stream.innerHTML = site.groups.map(function (group) {
            var modules = group.modules.map(function (mod) {
                return '<article class="module-slot" id="' + mod.id + '" data-src="' + mod.src + '"></article>';
            }).join('');

            return (
                '<section class="content-group" id="section-' + group.id + '">' +
                '<header class="group-header">' +
                '<p class="group-eyebrow">' + group.eyebrow + '</p>' +
                '<h2 class="group-title">' + group.title + '</h2>' +
                '</header>' +
                '<div class="group-modules">' + modules + '</div>' +
                '</section>'
            );
        }).join('');
    }

    function renderFooter(site) {
        var footer = document.getElementById('site-footer');
        if (footer) {
            footer.textContent = site.footer;
        }
    }

    function collectModules(site) {
        var list = [];
        site.groups.forEach(function (group) {
            group.modules.forEach(function (mod) {
                list.push(mod);
            });
        });
        return list;
    }

    function bindNavScroll(site) {
        var links = document.querySelectorAll('.profile-nav-link');
        if (!links.length || !('IntersectionObserver' in window)) {
            return;
        }

        var map = {};
        site.nav.forEach(function (item) {
            map['section-' + item.id] = item.id;
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }
                var navId = map[entry.target.id];
                if (!navId) {
                    return;
                }
                links.forEach(function (link) {
                    link.classList.toggle('is-active', link.getAttribute('data-nav') === navId);
                });
            });
        }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

        site.nav.forEach(function (item) {
            var section = document.getElementById('section-' + item.id);
            if (section) {
                observer.observe(section);
            }
        });
    }

    function handlePdfReferral() {
        try {
            var urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('frompdf') === 'true') {
                alert('Thank you for coming from PDF file to My Digital CV!');
                window.history.replaceState({}, document.title, window.location.pathname || '/');
            }
        } catch (e) {
            /* ignore */
        }
    }

    function boot() {
        setReady(false);

        GeeSuthLoader.fetchJson('data/site.json')
            .then(function (site) {
                window.GeeSuthSite = site;
                renderProfile(site);
                renderNav(site);
                renderGroups(site);
                renderFooter(site);
                GeeSuthQuotes.render('#random-quote');
                GeeSuthModal.bind();
                bindNavScroll(site);

                return GeeSuthLoader.loadModules(collectModules(site));
            })
            .then(function () {
                setReady(true);
                handlePdfReferral();
            })
            .catch(function (error) {
                console.error(error);
                setReady(true);
                var stream = document.getElementById('content-stream');
                if (stream) {
                    stream.innerHTML = '<div class="module-error">Portfolio failed to load. Please refresh the page.</div>';
                }
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
