// Localization and simple UI behavior for GlasHaus Service site
const translations = {
  en: {
    pageTitle: 'GlasHaus Service',
    headerTitle: 'GlasHaus Service',
    navHome: 'Home',
    navAbout: 'About',
    navGallery: 'Gallery',
    navContact: 'Contact',
    navFeedback: 'Feedback',
    navDatenschutz: 'Privacy',
    navImpressum: 'Imprint',
    heroTitle: 'Professional glass services',
    heroDesc: 'Installation, repair and replacement of windows, doors and glass structures.',
    heroCta: 'Contact us',
    footer: '© GlasHaus Service 2026',
    footerDatenschutz: 'Privacy',
    footerImpressum: 'Imprint'
  },
  de: {
    pageTitle: 'GlasHaus Service',
    headerTitle: 'GlasHaus Service',
    navHome: 'Startseite',
    navAbout: 'Über uns',
    navGallery: 'Galerie',
    navContact: 'Kontakt',
    navFeedback: 'Feedback',
    navDatenschutz: 'Datenschutz',
    navImpressum: 'Impressum',
    heroTitle: 'Professionelle Glasdienstleistungen',
    heroDesc: 'Installation, Reparatur und Austausch von Fenstern, Türen und Glasstrukturen.',
    heroCta: 'Kontaktieren Sie uns',
    footer: '© GlasHaus Service 2026',
    footerDatenschutz: 'Datenschutz',
    footerImpressum: 'Impressum'
  },
  ru: {
    pageTitle: 'GlasHaus Service',
    headerTitle: 'GlasHaus Service',
    navHome: 'Главная',
    navAbout: 'О нас',
    navGallery: 'Галерея',
    navContact: 'Контакты',
    navFeedback: 'Отзывы',
    navDatenschutz: 'Конфиденциальность',
    navImpressum: 'Impressум',
    heroTitle: 'Профессиональные стеклянные услуги',
    heroDesc: 'Установка, ремонт и замена окон, дверей и стеклянных конструкций.',
    heroCta: 'Связаться с нами',
    footer: '© GlasHaus Service 2026',
    footerDatenschutz: 'Конфиденциальность',
    footerImpressum: 'Impressум'
  }
};

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function changeLanguage(lang) {
  if (!translations[lang]) lang = 'ru';
  const t = translations[lang];

  document.documentElement.lang = lang;
  setText('page-title', t.pageTitle);
  setText('header-title', t.headerTitle);

  setText('nav-home', t.navHome);
  setText('nav-about', t.navAbout);
  setText('nav-gallery', t.navGallery);
  setText('nav-contact', t.navContact);
  setText('nav-feedback', t.navFeedback);
  setText('nav-datenschutz', t.navDatenschutz);
  setText('nav-impressum', t.navImpressum);

  setText('hero-title', t.heroTitle);
  setText('hero-desc', t.heroDesc);
  setText('hero-cta', t.heroCta);

  setText('footer', t.footer);
  // footer links (if present)
  const fDat = document.getElementById('footer-datenschutz');
  if (fDat) fDat.textContent = t.footerDatenschutz;
  const fImp = document.getElementById('footer-impressum');
  if (fImp) fImp.textContent = t.footerImpressum;
}

// Initialize default language from document or fallback to 'ru'
document.addEventListener('DOMContentLoaded', () => {
  const initialLang = document.documentElement.lang || 'ru';
  changeLanguage(initialLang);

  // Mobile menu toggle (in case script.js is responsible for it)
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
});

// Expose to global so onclick attributes work
window.changeLanguage = changeLanguage;
