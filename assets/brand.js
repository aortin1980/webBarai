(function () {
    // Detect domain OR allow local testing via URL parameter (?brand=tucamarero)
    const isTuCamarero = window.location.hostname.includes('tucamarero.com') || window.location.search.includes('brand=tucamarero');

    if (!isTuCamarero) return;

    // Define replacements
    const brandName = "tuCamarero";
    const brandEmail = "info@tucamarero.com";
    const brandApp = "app.tucamarero.com";
    const brandWeb = "www.tucamarero.com";

    // Inject Google Font (Roboto for body, Montserrat for logo)
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Montserrat:wght@400;800&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Override Tailwind Config
    if (window.tailwind && window.tailwind.config) {
        window.tailwind.config.theme.extend.colors.darkBg = '#0c2445'; // Navy
        window.tailwind.config.theme.extend.colors.cardBg = '#143868';
        window.tailwind.config.theme.extend.colors.neonGreen = '#cd5f38'; // Copper
        window.tailwind.config.theme.extend.colors.neonCyan = '#d9774b';  // Light Copper
        window.tailwind.config.theme.extend.colors.darkGreen = '#06132b';
        window.tailwind.config.theme.extend.fontFamily.sans = ['Roboto', 'sans-serif'];
    }

    // Inject Custom CSS for Light/Dark alternating sections
    const styleBlock = document.createElement('style');
    styleBlock.textContent = `
        /* Light Sections */
        #dashboard-preview, #features, #calculator, #pricing, #testimonials, #contact {
            background-color: #f6f5f0 !important;
            border-color: #e5e5e5 !important;
            color: #1a1a1a !important;
        }
        
        #dashboard-preview h2, #features h2, #calculator h2, #pricing h2, #testimonials h2, #contact h2,
        #dashboard-preview h3, #features h3, #calculator h3, #pricing h3, #testimonials h3, #contact h3,
        #dashboard-preview h4, #features h4, #calculator h4, #pricing h4, #testimonials h4, #contact h4,
        #dashboard-preview .text-white, #features .text-white, #calculator .text-white, #pricing .text-white, #testimonials .text-white, #contact .text-white {
            color: #0c2445 !important;
        }

        #dashboard-preview p, #features p, #calculator p, #pricing p, #testimonials p, #contact p,
        #dashboard-preview .text-gray-400, #features .text-gray-400, #calculator .text-gray-400, #pricing .text-gray-400, #testimonials .text-gray-400, #contact .text-gray-400,
        #dashboard-preview .text-gray-300, #features .text-gray-300, #calculator .text-gray-300, #pricing .text-gray-300, #testimonials .text-gray-300, #contact .text-gray-300 {
            color: #4a4a4a !important;
        }

        /* Light Cards */
        #dashboard-preview .bg-cardBg, #features .bg-cardBg, #calculator .bg-cardBg, #pricing .bg-cardBg, #testimonials .bg-cardBg, #contact .bg-cardBg,
        #dashboard-preview .bg-gray-900, #pricing .bg-gray-900 {
            background-color: #ffffff !important;
            border-color: #e5e5e5 !important;
        }

        #dashboard-preview .border-gray-800, #features .border-gray-800, #calculator .border-gray-800, #pricing .border-gray-800, #testimonials .border-gray-800, #contact .border-gray-800 {
            border-color: #e5e5e5 !important;
        }

        /* Fix 'Solicitar Demo' and action buttons to be light green instead of copper-to-green gradient */
        #pricing .from-neonGreen.to-emerald-500,
        #dashboard-preview .from-neonGreen.to-emerald-500,
        #features .from-neonGreen.to-emerald-500,
        #contact .from-neonGreen.to-emerald-500,
        .from-neonGreen.to-emerald-500 {
            background-image: none !important;
            background-color: #10b981 !important; /* Light Green */
            color: #0c2445 !important; /* Dark text for contrast */
            border: 2px solid #10b981 !important;
        }

        /* Ensure gradients on light bg look solid copper (excluding the buttons we just made green) */
        #dashboard-preview .bg-gradient-to-r:not(.from-neonGreen), #features .bg-gradient-to-r:not(.from-neonGreen), #pricing .bg-gradient-to-r:not(.from-neonGreen), #contact .bg-gradient-to-r:not(.from-neonGreen),
        #dashboard-preview .bg-gradient-to-b, #pricing .bg-gradient-to-b {
            background-image: none !important;
            background-color: #cd5f38 !important;
            color: white !important;
        }
        
        /* EXCEPTIONS: Fix text inside gradients and dark cards within light sections */
        .bg-gradient-to-r h2, .bg-gradient-to-r h3, .bg-gradient-to-r p, .bg-gradient-to-r span, .bg-gradient-to-r div, 
        .bg-gradient-to-b h2, .bg-gradient-to-b h3, .bg-gradient-to-b p, .bg-gradient-to-b span, .bg-gradient-to-b div, .bg-gradient-to-b li {
            color: #ffffff !important;
        }

        /* Ensure .text-gray-400 and .text-gray-300 inside ANY gradient keeps being white/light, overriding the ID rules */
        #dashboard-preview .bg-gradient-to-r .text-gray-400, #features .bg-gradient-to-r .text-gray-400, #pricing .bg-gradient-to-r .text-gray-400, #contact .bg-gradient-to-r .text-gray-400, #testimonials .bg-gradient-to-r .text-gray-400,
        #dashboard-preview .bg-gradient-to-b .text-gray-400, #pricing .bg-gradient-to-b .text-gray-400,
        #testimonials .bg-gradient-to-r .text-gray-300, #testimonials .bg-gradient-to-r div {
            color: #ffffff !important;
        }

        /* Calculator dark cards - keep text white */
        #calculator .bg-gray-900\\/90 {
            background-color: #143868 !important; /* Navy Blue Card */
        }
        #calculator .bg-gray-900\\/90 div, #calculator .bg-gray-900\\/90 span, #calculator .bg-gray-900\\/90 .text-gray-400 {
            color: #ffffff !important;
        }

        /* Footer can stay dark, customer-story stays dark */
        #customer-story {
            background-color: #0c2445 !important;
        }
        
        /* Make tab buttons unselected state darker on light bg */
        .tab-btn:not(.active) {
            color: #4a4a4a !important;
            background-color: #e5e5e5 !important;
        }
    `;
    document.head.appendChild(styleBlock);

    // Update Title
    if (document.title.includes('BarAI')) {
        document.title = document.title.replace(/BarAI/g, brandName);
    }
    
    // Update SEO Meta Tags and Canonical Links for crawlers and social sharing
    document.querySelectorAll('meta').forEach(meta => {
        if (meta.hasAttribute('content')) {
            let content = meta.getAttribute('content');
            let updated = false;
            
            if (content.toLowerCase().includes('barai')) {
                // Handle the specific "BarAI Technologies" author/rights
                if (content.includes('BarAI Technologies')) {
                    content = content.replace(/BarAI Technologies/gi, 'tuCamarero');
                } else {
                    content = content.replace(/BarAI/gi, brandName);
                }
                updated = true;
            }
            if (content.includes('barai.es')) {
                content = content.replace(/barai\.es/gi, 'tucamarero.com');
                updated = true;
            }
            
            if (updated) {
                meta.setAttribute('content', content);
            }
        }
    });

    document.querySelectorAll('link[rel="canonical"], link[rel="alternate"]').forEach(link => {
        if (link.hasAttribute('href')) {
            let href = link.getAttribute('href');
            if (href.includes('barai.es')) {
                link.setAttribute('href', href.replace(/barai\.es/g, 'tucamarero.com'));
            }
        }
    });

    // Function to walk the DOM and replace text
    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            let updated = false;

            if (text.includes('BarAI')) {
                text = text.replace(/BarAI/g, brandName);
                updated = true;
            }
            if (text.includes('Bar AI')) {
                text = text.replace(/Bar AI/g, brandName);
                updated = true;
            }
            if (text.includes('info@barai.es')) {
                text = text.replace(/info@barai\.es/g, brandEmail);
                updated = true;
            }
            if (text.includes('app.barai.es')) {
                text = text.replace(/app\.barai\.es/g, brandApp);
                updated = true;
            }
            if (text.includes('www.barai.es')) {
                text = text.replace(/www\.barai\.es/g, brandWeb);
                updated = true;
            }
            if (text.includes('barai.es')) {
                text = text.replace(/barai\.es/g, 'tucamarero.com');
                updated = true;
            }

            if (updated) {
                node.nodeValue = text;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            if (tagName !== 'script' && tagName !== 'style' && tagName !== 'noscript') {
                for (let i = 0; i < node.childNodes.length; i++) {
                    replaceTextInNode(node.childNodes[i]);
                }
            }

            // Also check attributes like href, src, alt, placeholder
            if (node.hasAttribute('href')) {
                let href = node.getAttribute('href');
                if (href.includes('barai.es')) {
                    node.setAttribute('href', href.replace(/barai\.es/g, 'tucamarero.com'));
                }
                if (href.includes('mailto:info@barai.es')) {
                    node.setAttribute('href', href.replace('info@barai.es', brandEmail));
                }
            }
            if (node.hasAttribute('alt')) {
                let alt = node.getAttribute('alt');
                if (alt.includes('BarAI')) {
                    node.setAttribute('alt', alt.replace(/BarAI/g, brandName));
                }
            }
            if (node.hasAttribute('src')) {
                let src = node.getAttribute('src');
                let filename = src.split('/').pop();
                if (filename === 'logo.png') {
                    node.setAttribute('src', src.replace('logo.png', 'logo-tucamarero.png'));
                    // Force white background on the parent container if it's a div
                    if (node.parentElement && node.parentElement.tagName === 'DIV') {
                        node.parentElement.style.backgroundColor = '#ffffff';
                    }
                } else if (filename === 'logo_b.png') {
                    node.setAttribute('src', src.replace('logo_b.png', 'logo-tucamarero_b.png'));
                    if (node.parentElement && node.parentElement.tagName === 'DIV') {
                        node.parentElement.style.backgroundColor = '#ffffff';
                    }
                }
            }
        }
    }

    // Run on DOMContentLoaded
    document.addEventListener("DOMContentLoaded", () => {
        // Rewrite the translations object if it exists so i18n doesn't overwrite our branding
        if (typeof translations !== 'undefined') {
            for (let lang in translations) {
                for (let key in translations[lang]) {
                    if (typeof translations[lang][key] === 'string') {
                        translations[lang][key] = translations[lang][key]
                            .replace(/BarAI/g, brandName)
                            .replace(/Bar AI/g, brandName)
                            .replace(/info@barai\.es/g, brandEmail);
                    }
                }
            }
            // Reapply translations with the new brand if applyLang exists
            if (typeof applyLang === 'function' && typeof currentLang !== 'undefined') {
                applyLang(currentLang);
            }
        }

        replaceTextInNode(document.body);

        // Replace the specific logo HTML structures (Bar<span class="gradient-text">AI</span>)
        const allSpans = document.querySelectorAll('span');
        allSpans.forEach(span => {
            // Check if this span contains exactly "BarAI" when stripped of HTML
            if (span.textContent.trim() === 'BarAI' && span.innerHTML.includes('<span')) {
                span.innerHTML = '<span style="font-weight: 400;">tu</span><span style="font-weight: 800;">camarero</span>';
                span.style.fontFamily = "'Montserrat', sans-serif";
                span.style.textTransform = "lowercase";
                span.style.color = "#000000";
                span.classList.remove('text-white');
            }
        });
    });

})();
