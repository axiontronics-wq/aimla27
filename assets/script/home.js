/* ===== Discover by Places — Carousel ===== */
(function () {
    const slides = document.querySelectorAll('.place-slide');
    const dots = document.querySelectorAll('.place-dot');

    if (slides.length === 0) return;

    let current = 0;
    let autoPlayTimer = null;
    const AUTOPLAY_DELAY = 6000;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        current = index;
    }

    function nextPlace() {
        showSlide((current + 1) % slides.length);
        restartAutoPlay();
    }

    function prevPlace() {
        showSlide((current - 1 + slides.length) % slides.length);
        restartAutoPlay();
    }

    function goToPlace(index) {
        showSlide(index);
        restartAutoPlay();
    }

    function startAutoPlay() {
        autoPlayTimer = setInterval(() => {
            showSlide((current + 1) % slides.length);
        }, AUTOPLAY_DELAY);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    window.nextPlace = nextPlace;
    window.prevPlace = prevPlace;
    window.goToPlace = goToPlace;

    const carousel = document.querySelector('.places-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextPlace();
        if (e.key === 'ArrowLeft') prevPlace();
    });

    let touchStartX = 0;
    if (carousel) {
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) < 50) return;
            if (diff > 0) nextPlace();
            else prevPlace();
        }, { passive: true });
    }

    startAutoPlay();
})();