(function (global) {
    'use strict';

    function fetchText(url) {
        return fetch(url, { cache: 'no-cache' }).then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to load ' + url + ' (' + response.status + ')');
            }
            return response.text();
        });
    }

    function fetchJson(url) {
        return fetch(url, { cache: 'no-cache' }).then(function (response) {
            if (!response.ok) {
                throw new Error('Failed to load ' + url + ' (' + response.status + ')');
            }
            return response.json();
        });
    }

    function uniquifyBootstrapIds(root, prefix) {
        if (!root) {
            return;
        }

        var idMap = {};
        root.querySelectorAll('[id]').forEach(function (node) {
            var oldId = node.id;
            if (!oldId) {
                return;
            }
            var newId = prefix + '-' + oldId;
            idMap[oldId] = newId;
            node.id = newId;
        });

        root.querySelectorAll('[data-bs-target], [data-bs-parent], [aria-controls], [aria-labelledby], [href^="#"]').forEach(function (node) {
            ['data-bs-target', 'data-bs-parent', 'aria-controls', 'aria-labelledby', 'href'].forEach(function (attr) {
                var value = node.getAttribute(attr);
                if (!value || value.charAt(0) !== '#') {
                    return;
                }
                var key = value.slice(1);
                if (idMap[key]) {
                    node.setAttribute(attr, '#' + idMap[key]);
                }
            });
        });
    }

    function mountHtml(el, html, moduleId) {
        if (!el) {
            return;
        }
        el.innerHTML = html;
        uniquifyBootstrapIds(el, moduleId || el.id || 'mod');
        el.classList.add('is-loaded');
    }

    function mountError(el, message) {
        if (!el) {
            return;
        }
        el.innerHTML = '<div class="module-error">' + message + '</div>';
        el.classList.add('is-loaded', 'is-error');
    }

    function loadModule(module) {
        var target = document.getElementById(module.id);
        return fetchText(module.src)
            .then(function (html) {
                mountHtml(target, html, module.id);
            })
            .catch(function (error) {
                console.error(error);
                mountError(target, 'Could not load this module. Please refresh.');
            });
    }

    function loadModules(modules) {
        return Promise.all(modules.map(loadModule));
    }

    global.GeeSuthLoader = {
        fetchText: fetchText,
        fetchJson: fetchJson,
        loadModule: loadModule,
        loadModules: loadModules
    };
})(window);
