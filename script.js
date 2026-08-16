document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('siteLang') || 'de';
    loadLanguage(savedLang);

    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

async function loadLanguage(lang) {
    try {
        const response = await fetch(`translations/${lang}.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        const translations = await response.json();
        
        document.documentElement.lang = lang;
        localStorage.setItem('siteLang', lang);

        document.querySelectorAll('.lang-switch a').forEach(a => {
            a.classList.remove('active-lang');
            if (a.getAttribute('onclick').includes(`'${lang}'`)) {
                a.classList.add('active-lang');
            }
        });

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[key];
                } else {
                    el.innerHTML = translations[key];
                }
            }
        });
    } catch (error) {
        console.error('Ошибка загрузки языка:', error);
    }
}

window.changeLanguage = function(lang, event) {
    if(event) event.preventDefault();
    loadLanguage(lang);
};
