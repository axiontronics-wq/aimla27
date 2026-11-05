/* Site-wide behaviour: nav, hero slideshow, smooth scrolling. */
/* ===== Mobile nav toggle ===== */
function toggleNav() {
    document.getElementById('navMenu').classList.toggle('open');
}

/* ===== Mobile: dropdown parent click toggles accordion ===== */
const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;

document.querySelectorAll('.nav-item > a').forEach(link => {
    link.addEventListener('click', function(e) {
        const parent = this.parentElement;
        const hasDropdown = parent.querySelector('.dropdown');

        if (!hasDropdown) return;

        if (isMobile()) {
            e.preventDefault();
            const wasOpen = parent.classList.contains('open');
            // close others
            document.querySelectorAll('.nav-item.open').forEach(i => {
                if (i !== parent) i.classList.remove('open');
            });
            parent.classList.toggle('open', !wasOpen);
        }
    });
});

/* ===== Close mobile menu on outside click ===== */
document.addEventListener('click', function(e) {
    const menu = document.getElementById('navMenu');
    const toggle = document.querySelector('.mobile-toggle');
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
        document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
    }
});

/* ===== Close mobile menu on dropdown link click ===== */
document.querySelectorAll('.dropdown a').forEach(link => {
    link.addEventListener('click', function() {
        if (isMobile()) {
            document.getElementById('navMenu').classList.remove('open');
            document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
        }
    });
});

/* ===== Escape key closes everything ===== */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('navMenu').classList.remove('open');
        document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
    }
});

/* ===== Smooth scroll for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            const offset = 72;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ===== Hero background slideshow ===== */
(function () {
    const slides = document.querySelectorAll('.hero-bg .slide');
    if (slides.length < 2) return;
    let current = 0;
    setInterval(function () {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 5000);
})();
