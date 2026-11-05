        // ===== AUTO-CLOSE TIMER =====
        let autoCloseTimer = null;
        const AUTO_CLOSE_DELAY = 8000; // 8 seconds

        function resetAutoCloseTimer() {
            clearTimeout(autoCloseTimer);
            const openSections = document.querySelectorAll('.committee-section.open');
            if (openSections.length > 0) {
                autoCloseTimer = setTimeout(() => {
                    closeAllSections();
                }, AUTO_CLOSE_DELAY);
            }
        }

        function closeAllSections() {
            document.querySelectorAll('.committee-section.open').forEach(section => {
                const body = section.querySelector('.section-body');
                const icon = section.querySelector('.section-toggle-icon');
                section.classList.remove('open');
                body.style.maxHeight = null;
                icon.textContent = '+';
            });
        }

        // ===== COLLAPSIBLE SECTION TOGGLE =====
        function toggleSection(btn) {
            const section = btn.closest('.committee-section');
            const body = section.querySelector('.section-body');
            const icon = section.querySelector('.section-toggle-icon');
            const isOpen = section.classList.contains('open');

            if (isOpen) {
                body.style.maxHeight = null;
                section.classList.remove('open');
                icon.textContent = '+';
                if (document.querySelectorAll('.committee-section.open').length === 0) {
                    clearTimeout(autoCloseTimer);
                }
            } else {
                section.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
                icon.textContent = '−';
                resetAutoCloseTimer();
            }
        }

        // ===== ACTIVITY LISTENERS =====
        ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(event => {
            document.addEventListener(event, resetAutoCloseTimer, { passive: true });
        });

        // ===== VISIBILITY CHANGE =====
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                closeAllSections();
                clearTimeout(autoCloseTimer);
            } else {
                resetAutoCloseTimer();
            }
        });

        // Recalculate heights when window resizes
        window.addEventListener('resize', () => {
            document.querySelectorAll('.committee-section.open').forEach(section => {
                const body = section.querySelector('.section-body');
                if (body) {
                    body.style.maxHeight = body.scrollHeight + 'px';
                }
            });
        });

        // ===== OPEN SECTION VIA HASH ON PAGE LOAD =====
        window.addEventListener('load', function() {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const targetSection = document.getElementById(hash);
                if (targetSection && targetSection.classList.contains('committee-section')) {
                    setTimeout(() => {
                        targetSection.classList.add('open');
                        const body = targetSection.querySelector('.section-body');
                        if (body) {
                            body.style.maxHeight = body.scrollHeight + 'px';
                        }
                        const icon = targetSection.querySelector('.section-toggle-icon');
                        if (icon) icon.textContent = '−';
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 200);
                } else if (targetSection) {
                    setTimeout(() => {
                        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 200);
                }
            }
        });

        