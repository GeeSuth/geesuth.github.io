(function (global) {
    'use strict';

    var STYLE_PARTS = {
        orbit: [
            '<span class="profile-photo-ring" aria-hidden="true"></span>',
            '<span class="profile-photo-orbit" aria-hidden="true"></span>',
            '<span class="profile-photo-orbit profile-photo-orbit--lag" aria-hidden="true"></span>'
        ],
        ring: [
            '<span class="profile-photo-ring" aria-hidden="true"></span>'
        ],
        glow: [
            '<span class="profile-photo-glow" aria-hidden="true"></span>'
        ],
        simple: []
    };

    function resolvePhoto(config) {
        var photo = config && typeof config === 'object' ? config : {};
        var gallery = photo.gallery || {};
        var active = photo.active || Object.keys(gallery)[0] || '';
        var src = gallery[active] || photo.src || 'img/im1.png';

        return {
            src: src,
            alt: photo.alt || 'Profile photo',
            active: active,
            style: photo.style || 'orbit',
            shape: photo.shape || 'rounded',
            position: photo.position || 'center top'
        };
    }

    function render(config) {
        var photo = resolvePhoto(config);
        var parts = STYLE_PARTS[photo.style] || STYLE_PARTS.orbit;
        var classes = [
            'profile-photo-frame',
            'photo-style-' + photo.style,
            'photo-shape-' + photo.shape
        ].join(' ');

        return (
            '<div class="' + classes + '" data-photo-key="' + photo.active + '">' +
            parts.join('') +
            '<div class="profile-photo" style="background-image:url(\'' + photo.src + '\');background-position:' + photo.position + ';" role="img" aria-label="' + photo.alt + '"></div>' +
            '</div>'
        );
    }

    global.GeeSuthPhoto = {
        resolve: resolvePhoto,
        render: render
    };
})(window);
