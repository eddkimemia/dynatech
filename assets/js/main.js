document.addEventListener('DOMContentLoaded', () => {
    /**
     * Determines the relative path to the root directory.
     * Works by counting how many levels deep the current page is.
     */
    const getRootPrefix = () => {
        // Get path relative to the domain root
        const path = window.location.pathname;

        // If we are at root or just index.html, prefix is empty
        // We assume files are either in root or in 1-level deep subdirectories
        const isSubPage = path.includes('/services/');
        return isSubPage ? '../' : '';
    };

    const rootPrefix = getRootPrefix();

    /**
     * Loads an HTML component and injects it into the DOM.
     * Programmatically adjusts relative paths for sub-pages.
     */
    const loadComponent = async (id, componentPath) => {
        const element = document.getElementById(id);
        if (!element) return;

        try {
            const response = await fetch(rootPrefix + componentPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const html = await response.text();

            // Use a temporary container to parse and manipulate the HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Only adjust paths if we are in a sub-directory
            if (rootPrefix) {
                // Adjust links
                tempDiv.querySelectorAll('a[href]').forEach(link => {
                    const href = link.getAttribute('href');
                    // Only prefix relative links that don't start with http, /, #, mailto, or tel
                    if (href && !/^(?:[a-z]+:|\/\/|#|\/)/i.test(href)) {
                        link.setAttribute('href', rootPrefix + href);
                    }
                });

                // Adjust images
                tempDiv.querySelectorAll('img[src]').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !/^(?:[a-z]+:|\/\/|\/)/i.test(src)) {
                        img.setAttribute('src', rootPrefix + src);
                    }
                });
            }

            // Move children from temp container to the actual element
            while (tempDiv.firstChild) {
                element.appendChild(tempDiv.firstChild);
            }

            // Initialize specific component logic
            if (id === 'main-header') {
                initMenuToggle();
            }
        } catch (error) {
            console.error(`Error loading component from ${componentPath}:`, error);
        }
    };

    const initMenuToggle = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    };

    // Load components
    loadComponent('main-header', 'assets/components/header.html');
    loadComponent('main-footer', 'assets/components/footer.html');

    // Also handle WhatsApp button if it exists as a separate placeholder or load it in footer
    // Currently, it's likely part of one of the components or in the main page.
});
