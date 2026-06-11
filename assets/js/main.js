document.addEventListener('DOMContentLoaded', () => {
    // Determine path prefix based on depth
    const pathDepth = window.location.pathname.split('/').filter(p => p !== '').length;
    // Handle the case where we might be at root but with a trailing slash or just /index.html
    // If we are at root, depth is 0 or 1 (for /index.html)
    // If we are in services/, depth is 2 (for /services/mechanical-engineering.html)
    const isSubPage = window.location.pathname.includes('/services/');
    const prefix = isSubPage ? '../' : '';

    // Component Loading
    const loadComponent = async (id, path) => {
        const element = document.getElementById(id);
        if (!element) return;

        try {
            const response = await fetch(path);
            if (response.ok) {
                let html = await response.text();

                // Adjust paths in the loaded HTML for sub-pages
                if (isSubPage) {
                    html = html.replace(/href="(?!http|https|#|\/)/g, 'href="../');
                    html = html.replace(/src="(?!http|https|\/)/g, 'src="../');
                    // Special case for absolute root paths starting with /
                    html = html.replace(/href="\//g, 'href="../');
                    html = html.replace(/src="\//g, 'src="../');
                } else {
                    // Just remove the leading / for root pages to keep them relative
                    html = html.replace(/href="\//g, 'href="');
                    html = html.replace(/src="\//g, 'src="');
                }

                element.innerHTML = html;

                if (id === 'main-header') {
                    initMenuToggle();
                }
            }
        } catch (error) {
            console.error(`Error loading component from ${path}:`, error);
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

    // Load components using relative paths
    loadComponent('main-header', prefix + 'assets/components/header.html');
    loadComponent('main-footer', prefix + 'assets/components/footer.html');

    initMenuToggle();
});
