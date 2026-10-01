(function() {
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
        window.tailwind.config.theme.extend.colors.darkBg = '#0c2445';
        window.tailwind.config.theme.extend.colors.cardBg = '#143868';
        window.tailwind.config.theme.extend.colors.neonGreen = '#cd5f38'; // orange/copper
        window.tailwind.config.theme.extend.colors.neonCyan = '#d9774b';  // lighter orange
        window.tailwind.config.theme.extend.colors.darkGreen = '#06132b';
        window.tailwind.config.theme.extend.fontFamily.sans = ['Roboto', 'sans-serif'];
    }

    // Update Title
    if (document.title.includes('BarAI')) {
        document.title = document.title.replace(/BarAI/g, brandName);
    }

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
                if (src.includes('logo.png')) {
                    node.setAttribute('src', src.replace('logo.png', 'logo-tucamarero.png'));
                } else if (src.includes('logo_b.png')) {
                    node.setAttribute('src', src.replace('logo_b.png', 'logo-tucamarero_b.png'));
                }
            }
        }
    }

    // Run on DOMContentLoaded
    document.addEventListener("DOMContentLoaded", () => {
        replaceTextInNode(document.body);
        
        // Replace the specific logo HTML structures (Bar<span class="gradient-text">AI</span>)
        const allSpans = document.querySelectorAll('span');
        allSpans.forEach(span => {
            // Check if this span contains exactly "BarAI" when stripped of HTML
            if (span.textContent.trim() === 'BarAI' && span.innerHTML.includes('<span')) {
                span.innerHTML = '<span style="font-weight: 400;">tu</span><span style="font-weight: 800;">camarero</span>';
                span.style.fontFamily = "'Montserrat', sans-serif";
                span.style.textTransform = "lowercase";
                span.classList.remove('text-white');
                // We use white so it's visible on the dark navbar, as dark blue would be invisible
                span.style.color = '#ffffff'; 
            }
        });
    });

})();
