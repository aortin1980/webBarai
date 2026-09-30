/**
 * BarAI — Shared i18n Engine v2.0
 * Covers secondary pages.
 */

(function () {
    'use strict';

    const T = {
        es: {
            nav_home: 'Inicio',
            nav_how: 'Cómo Pedir',
            nav_ticket: 'Ticket Digital',
            nav_rating: 'Valoración',
            nav_faq: 'Preguntas Frecuentes',
            nav_staff_guide: 'Guía Personal',
            nav_client_guide: 'Guía Clientes',
            nav_support: 'Soporte',
            nav_open_ticket: 'Abrir Ticket',
            nav_back: 'Inicio',
            nav_im_bar: 'Soy un Bar',
            lang_toggle: 'EN',
            footer_client_guide: 'Guía Clientes',
            footer_staff_guide: 'Guía Personal',
            footer_support: 'Soporte Técnico',
            footer_ticket_terms: 'Condiciones Ticket Digital',
            footer_legal: 'Aviso legal',
            footer_privacy: 'Política de privacidad',
            footer_cookies: 'Política de cookies',
            footer_rights: '© 2026 BarAI Technologies. Todos los derechos reservados.',
            back_to_home: '← Volver al Inicio',
            view_en: 'View in English'
        },
        en: {
            nav_home: 'Home',
            nav_how: 'How to Order',
            nav_ticket: 'Digital Receipt',
            nav_rating: 'Rating',
            nav_faq: 'FAQs',
            nav_staff_guide: 'Staff Guide',
            nav_client_guide: 'Customer Guide',
            nav_support: 'Support',
            nav_open_ticket: 'Open Ticket',
            nav_back: 'Home',
            nav_im_bar: 'I\'m a Bar',
            lang_toggle: 'ES',
            footer_client_guide: 'Customer Guide',
            footer_staff_guide: 'Staff Guide',
            footer_support: 'Technical Support',
            footer_ticket_terms: 'Digital Receipt Terms',
            footer_legal: 'Legal Notice',
            footer_privacy: 'Privacy Policy',
            footer_cookies: 'Cookie Policy',
            footer_rights: '© 2026 BarAI Technologies. All rights reserved.',
            back_to_home: '← Back to Home',
            view_en: 'Ver en Español'
        }
    };

    function detectLang() {
        const urlParam = new URLSearchParams(window.location.search).get('lang');
        const stored = localStorage.getItem('barai_lang');
        const browser = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
        let lang;
        if (urlParam && (urlParam === 'es' || urlParam === 'en')) {
            lang = urlParam;
        } else if (stored && (stored === 'es' || stored === 'en')) {
            lang = stored;
        } else {
            lang = browser.startsWith('en') ? 'en' : 'es';
        }
        localStorage.setItem('barai_lang', lang);
        return lang;
    }

    function applyLang(lang) {
        const t = T[lang];
        if (!t) return;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) el.innerHTML = t[key];
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key] !== undefined) el.placeholder = t[key];
        });
        document.documentElement.lang = lang === 'en' ? 'en-US' : 'es';
        
        const btnDesktop = document.getElementById('lang-btn');
        const btnMobile = document.getElementById('lang-btn-mobile');
        const label = lang === 'es' ? 'EN' : 'ES';
        if (btnDesktop) btnDesktop.textContent = label;
        if (btnMobile) btnMobile.textContent = label;
    }

    window.toggleLang = function () {
        const current = localStorage.getItem('barai_lang') || 'es';
        const next = current === 'es' ? 'en' : 'es';
        localStorage.setItem('barai_lang', next);
        window.__barai_lang = next;
        
        const path = window.location.pathname;
        // If we are in a subpage (not root index.html) that has a localized folder structure
        if (path !== '/' && path !== '/index.html') {
            if (next === 'en' && !path.includes('/en/')) {
                window.location.href = '/en' + path;
                return;
            } else if (next === 'es' && path.includes('/en/')) {
                window.location.href = path.replace('/en/', '/');
                return;
            }
        }
        applyLang(next);
    };

    function injectLangButton() {
        const targets = [
            document.querySelector('header .flex.items-center'),
            document.querySelector('header nav'),
            document.querySelector('header')
        ];
        const container = targets.find(Boolean);
        if (!container) return;

        // check if it already exists
        if (document.getElementById('lang-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'lang-btn';
        btn.onclick = window.toggleLang;
        btn.className = 'ml-4 px-3 py-1.5 text-xs font-bold rounded-lg border border-neonGreen/50 text-neonGreen hover:bg-neonGreen/10 transition-all';
        btn.textContent = window.__barai_lang === 'es' ? 'EN' : 'ES';
        container.appendChild(btn);
    }

    const lang = detectLang();
    window.__barai_lang = lang;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyLang(lang);
            injectLangButton();
        });
    } else {
        applyLang(lang);
        injectLangButton();
    }
})();
