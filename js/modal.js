(function () {
    'use strict';

    function openLink(url) {
        if (!url) {
            return;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    function ViewImageInModal(clickedImageElement) {
        var modal = document.getElementById('ModalViewImage');
        if (!modal || !clickedImageElement) {
            return;
        }

        var src = '';
        if (clickedImageElement.localName === 'div') {
            if (String(clickedImageElement.className).indexOf('carousel-item') !== -1) {
                var imageInsideDiv = clickedImageElement.getElementsByClassName('card-project-img')[0];
                if (imageInsideDiv) {
                    src = imageInsideDiv.src;
                }
            }
        } else if (clickedImageElement.localName === 'img') {
            src = clickedImageElement.src;
        }

        if (!src) {
            return;
        }

        var modalImg = document.getElementById('Modalimg');
        var captionText = document.getElementById('caption');
        modal.classList.add('is-open');
        modal.style.display = 'block';
        modalImg.src = src;
        captionText.textContent = clickedImageElement.alt || 'Preview';
    }

    function closeModal() {
        var modal = document.getElementById('ModalViewImage');
        if (!modal) {
            return;
        }
        modal.classList.remove('is-open');
        modal.style.display = 'none';
    }

    function bindModal() {
        var modal = document.getElementById('ModalViewImage');
        var closeBtn = document.querySelector('.closeImageModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
            closeBtn.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    closeModal();
                }
            });
        }
        if (modal) {
            modal.addEventListener('click', function (event) {
                if (event.target === modal) {
                    closeModal();
                }
            });
        }
        window.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    }

    window.openLink = openLink;
    window.ViewImageInModal = ViewImageInModal;
    window.GeeSuthModal = { bind: bindModal, close: closeModal };
})();
