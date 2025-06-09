let translationsCache = {};

function flattenTranslations(obj, prefix = '', res = {}) {
    for (const key in obj) {
        const value = obj[key];
        const newKey = prefix ? `${prefix}-${key}` : key;
        if (typeof value === 'object' && value !== null) {
            flattenTranslations(value, newKey, res);
        } else {
            res[newKey] = value;
        }
    }
    return res;
}

async function loadTranslations(lang) {
    if (translationsCache[lang]) return translationsCache[lang];
    try {
        const response = await fetch(`translations/${lang}.json`);
        const data = await response.json();
        const flat = flattenTranslations(data);
        translationsCache[lang] = flat;
        return flat;
    } catch (error) {
        console.error(`Ошибка загрузки переводов для ${lang}:`, error);
        return {};
    }
}

async function changeLanguage(lang) {
    const translations = await loadTranslations(lang);
    document.documentElement.lang = lang;

    for (const key in translations) {
        const el = document.getElementById(key);
        if (el) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = translations[key];
            } else if (el.tagName === "BUTTON" || el.tagName === "A") {
                el.textContent = translations[key];
            } else {
                el.innerHTML = translations[key];
            }
        }
    }

    // Обновление заголовка страницы
    const pagePath = window.location.pathname.split('/').pop();
    let pageTitle = translations.title;
    if (pagePath === 'about.html') pageTitle = translations['about-title'] + ' | ' + translations.title;
    else if (pagePath === 'gallery.html') pageTitle = translations.gallery + ' | ' + translations.title;
    else if (pagePath === 'contact.html') pageTitle = translations['contact-title'] + ' | ' + translations.title;
    else if (pagePath === 'feedback.html') pageTitle = translations['feedback-title'] + ' | ' + translations.title;
    document.getElementById('page-title').textContent = pageTitle;

    // Обновление футера
    document.getElementById('footer').innerHTML = `© 2025 GlasHaus. ${translations.footer}`;

    localStorage.setItem('language', lang);
}

document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('active');
});

window.onload = async () => {
    const savedLang = localStorage.getItem('language') || 'de';
    await changeLanguage(savedLang);
};