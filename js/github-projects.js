(function (global) {
    'use strict';

    var LANG_COLORS = {
        'C#': '#178600',
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Dart': '#00B4AB',
        'Dockerfile': '#384d54',
        'Shell': '#89e051'
    };

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function breakableName(value) {
        return escapeHtml(value)
            .replace(/([a-z0-9])([A-Z])/g, '$1<wbr>$2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1<wbr>$2');
    }

    function safeUrl(value) {
        var url = String(value || '').trim();
        return /^https?:\/\//i.test(url) ? url : '';
    }

    function renderTopics(topics) {
        if (!Array.isArray(topics) || !topics.length) {
            return '';
        }

        return (
            '<div class="github-card-topics">' +
            topics.slice(0, 4).map(function (topic) {
                return '<span class="github-topic">' + escapeHtml(topic) + '</span>';
            }).join('') +
            '</div>'
        );
    }

    function renderLanguage(language) {
        if (!language) {
            return '';
        }
        var color = LANG_COLORS[language] || '#8a8179';
        return (
            '<span class="github-card-stat">' +
            '<span class="github-lang-dot" style="--github-lang-color:' + color + '"></span>' +
            escapeHtml(language) +
            '</span>'
        );
    }

    function renderStars(stars) {
        var count = Number(stars);
        if (!count || count < 1) {
            return '';
        }
        return (
            '<span class="github-card-stat" title="GitHub stars">' +
            '<i class="bi bi-star-fill" aria-hidden="true"></i>' +
            count +
            '</span>'
        );
    }

    function renderCard(project) {
        var name = escapeHtml(project.name || 'Untitled repository');
        var displayName = breakableName(project.name || 'Untitled repository');
        var url = safeUrl(project.url);
        if (!url) {
            return '';
        }

        var description = project.description
            ? '<p class="github-card-desc">' + escapeHtml(project.description) + '</p>'
            : '<p class="github-card-desc is-empty">No description provided yet.</p>';

        var homepage = safeUrl(project.homepage);
        var live = homepage
            ? '<a class="github-card-live" href="' + homepage + '" target="_blank" rel="noopener noreferrer">Live <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>'
            : '';

        return (
            '<article class="github-card">' +
                '<div class="github-card-head">' +
                    '<span class="github-card-icon" aria-hidden="true"><i class="bi bi-github"></i></span>' +
                    '<h3 class="github-card-name"><a href="' + url + '" target="_blank" rel="noopener noreferrer">' + displayName + '</a></h3>' +
                '</div>' +
                description +
                renderTopics(project.topics) +
                '<div class="github-card-foot">' +
                    '<div class="github-card-meta">' +
                        renderLanguage(project.language) +
                        renderStars(project.stars) +
                    '</div>' +
                    '<div class="github-card-actions">' +
                        live +
                        '<a class="github-card-link" href="' + url + '" target="_blank" rel="noopener noreferrer" aria-label="Open ' + name + ' repository on GitHub">Repository <i class="bi bi-arrow-right" aria-hidden="true"></i></a>' +
                    '</div>' +
                '</div>' +
            '</article>'
        );
    }

    function renderShell(data, projects) {
        var profileUrl = safeUrl(data.profileUrl);
        if (!profileUrl && data.username) {
            profileUrl = 'https://github.com/' + encodeURIComponent(data.username);
        }

        var intro = data.intro
            ? '<p class="github-projects-intro">' + escapeHtml(data.intro) + '</p>'
            : '';

        var railActions = projects.length > 1
            ? '<div class="github-projects-rail-actions">' +
                '<span class="github-projects-hint">Drag or scroll</span>' +
                '<button type="button" class="github-rail-btn" data-github-scroll="-1" aria-label="Scroll GitHub projects left"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>' +
                '<button type="button" class="github-rail-btn" data-github-scroll="1" aria-label="Scroll GitHub projects right"><i class="bi bi-arrow-right" aria-hidden="true"></i></button>' +
              '</div>'
            : '';

        var cta = profileUrl
            ? '<div class="github-projects-cta">' +
                '<p>Want to see the rest? Browse every repository, fork, and experiment on GitHub.</p>' +
                '<a class="github-projects-all" href="' + profileUrl + '" target="_blank" rel="noopener noreferrer"><i class="bi bi-github" aria-hidden="true"></i> View all repositories</a>' +
              '</div>'
            : '';

        if (!projects.length) {
            return '<p class="github-projects-status">No GitHub projects have been added yet.</p>';
        }

        return (
            '<div class="github-projects-head">' + intro + railActions + '</div>' +
            '<div class="github-projects-grid" tabindex="0" role="region" aria-label="GitHub projects, ordered by stars">' +
                projects.map(renderCard).join('') +
            '</div>' +
            cta
        );
    }

    function sortByStars(projects) {
        return projects.slice().sort(function (a, b) {
            return (Number(b.stars) || 0) - (Number(a.stars) || 0);
        });
    }

    function bindDragScroll(rail) {
        var isPointerDown = false;
        var isDragging = false;
        var suppressClick = false;
        var startX = 0;
        var startScrollLeft = 0;
        var activePointerId = null;

        function onPointerDown(event) {
            if (event.pointerType !== 'mouse' || event.button !== 0) {
                return;
            }

            isPointerDown = true;
            isDragging = false;
            startX = event.clientX;
            startScrollLeft = rail.scrollLeft;
            activePointerId = event.pointerId;
        }

        function onPointerMove(event) {
            if (!isPointerDown || event.pointerId !== activePointerId) {
                return;
            }

            var delta = event.clientX - startX;
            if (!isDragging && Math.abs(delta) > 5) {
                isDragging = true;
                try {
                    rail.setPointerCapture(activePointerId);
                } catch (error) {
                    /* ignore unsupported pointer capture */
                }
                rail.classList.add('is-dragging');
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
            }

            if (!isDragging) {
                return;
            }

            event.preventDefault();
            rail.scrollLeft = startScrollLeft - delta;
        }

        function endDrag(event) {
            if (!isPointerDown) {
                return;
            }

            if (activePointerId !== null) {
                try {
                    rail.releasePointerCapture(activePointerId);
                } catch (error) {
                    /* ignore unsupported pointer capture */
                }
            }

            if (isDragging) {
                suppressClick = true;
                window.setTimeout(function () {
                    suppressClick = false;
                }, 0);
            }

            isPointerDown = false;
            isDragging = false;
            activePointerId = null;
            rail.classList.remove('is-dragging');
        }

        rail.addEventListener('pointerdown', onPointerDown);
        rail.addEventListener('pointermove', onPointerMove);
        rail.addEventListener('pointerup', endDrag);
        rail.addEventListener('pointercancel', endDrag);
        rail.addEventListener('pointerleave', function (event) {
            if (isPointerDown && !isDragging) {
                endDrag(event);
            }
        });
        rail.addEventListener('click', function (event) {
            if (suppressClick) {
                event.preventDefault();
                event.stopPropagation();
                suppressClick = false;
            }
        }, true);
        rail.addEventListener('dragstart', function (event) {
            event.preventDefault();
        });
    }

    function bindRail(container) {
        var rail = container.querySelector('.github-projects-grid');
        if (!rail) {
            return;
        }

        var buttons = container.querySelectorAll('[data-github-scroll]');
        if (!buttons.length) {
            return;
        }

        function isAtStart() {
            return rail.scrollLeft <= 2;
        }

        function isAtEnd() {
            return rail.scrollLeft >= (rail.scrollWidth - rail.clientWidth) - 2;
        }

        function update() {
            Array.prototype.forEach.call(buttons, function (button) {
                var direction = Number(button.getAttribute('data-github-scroll'));
                button.disabled = direction < 0 ? isAtStart() : isAtEnd();
            });
        }

        Array.prototype.forEach.call(buttons, function (button) {
            button.addEventListener('click', function () {
                var direction = Number(button.getAttribute('data-github-scroll'));
                var amount = Math.max(rail.clientWidth * 0.85, 260);
                rail.scrollBy({ left: amount * direction, behavior: 'smooth' });
            });
        });

        rail.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        bindDragScroll(rail);
        update();
    }

    function render(container) {
        var src = container.getAttribute('data-github-projects');
        if (!src) {
            return Promise.resolve();
        }

        container.setAttribute('aria-busy', 'true');

        return fetch(src, { cache: 'no-cache' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Failed to load ' + src + ' (' + response.status + ')');
                }
                return response.json();
            })
            .then(function (data) {
                var projects = sortByStars(Array.isArray(data.projects) ? data.projects : []);
                container.innerHTML = renderShell(data, projects);
                bindRail(container);
                container.classList.add('is-ready');
                container.removeAttribute('aria-busy');
            })
            .catch(function (error) {
                console.error(error);
                container.innerHTML = '<div class="module-error">Could not load GitHub projects. Please refresh the page.</div>';
                container.removeAttribute('aria-busy');
            });
    }

    function renderAll() {
        var containers = document.querySelectorAll('[data-github-projects]');
        return Promise.all(Array.prototype.map.call(containers, render));
    }

    global.GeeSuthGithub = {
        render: render,
        renderAll: renderAll
    };
})(window);
