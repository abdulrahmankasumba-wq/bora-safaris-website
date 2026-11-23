/**
 * Bora East Africa Safaris - Blog Article Registry & Pagination Engine
 * 
 * Future Integration:
 * When you provide articles, simply add article objects to the BORA_BLOG_ARTICLES array below.
 * Each article will automatically be rendered in the grid with exact 80% image / 20% title ratio,
 * paginated at 15 articles per page (5 rows x 3 columns on desktop), and linked to its dedicated page.
 */

window.BORA_BLOG_ARTICLES = [
    {
        id: "beyond-the-ordinary-game-drive-lion-tracking",
        title: "Beyond the Ordinary Game Drive: Lion Tracking in Queen Elizabeth National Park",
        image: "tour image/lion on rock.jpeg",
        url: "blog/beyond-the-ordinary-game-drive-lion-tracking.html"
    },
    {
        id: "queen-elizabeth-vs-murchison-falls",
        title: "Queen Elizabeth vs Murchison Falls: Where Does Uganda Offer the Better Game Drive?",
        image: "tour image/giraffe sunset.jpeg",
        url: "blog/queen-elizabeth-vs-murchison-falls.html"
    }
];

(function () {
    'use strict';

    const ARTICLES_PER_PAGE = 15;
    let currentPage = 1;

    function initBlog() {
        const grid = document.getElementById('blogGrid');
        const pagination = document.getElementById('blogPagination');
        const standbyState = document.getElementById('blogStandbyState');

        if (!grid || !pagination) return;

        const articles = window.BORA_BLOG_ARTICLES || [];

        // Check URL parameters for page (e.g. blog.html?page=2)
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = parseInt(urlParams.get('page'), 10);
        const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);

        if (!isNaN(pageParam) && pageParam > 0) {
            currentPage = totalPages > 0 ? Math.min(pageParam, totalPages) : 1;
        }

        renderArticles(articles, grid, standbyState);
        renderPagination(articles, pagination);
    }

    function renderArticles(articles, grid, standbyState) {
        grid.innerHTML = '';

        if (!articles || articles.length === 0) {
            if (standbyState) {
                standbyState.style.display = 'block';
            }
            grid.style.display = 'none';
            return;
        }

        if (standbyState) {
            standbyState.style.display = 'none';
        }
        grid.style.display = 'grid';

        const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
        const pageArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

        pageArticles.forEach(article => {
            const card = document.createElement('a');
            card.className = 'blog-card';
            card.href = article.url || '#';
            card.setAttribute('aria-label', article.title);

            card.innerHTML = `
                <div class="blog-card__image-wrap">
                    <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.title)}" class="blog-card__image" loading="lazy">
                </div>
                <div class="blog-card__body">
                    <h3 class="blog-card__title">${escapeHtml(article.title)}</h3>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    function renderPagination(articles, pagination) {
        pagination.innerHTML = '';

        const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);

        // Hide pagination if 1 or 0 pages
        if (totalPages <= 1) {
            pagination.hidden = true;
            return;
        }

        pagination.hidden = false;

        // Previous Button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'blog-page-btn nav-step';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
        pagination.appendChild(prevBtn);

        // Page Number Buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = 'blog-page-btn' + (i === currentPage ? ' active' : '');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.setAttribute('aria-current', 'page');
            } else {
                pageBtn.addEventListener('click', () => goToPage(i));
            }
            pagination.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'blog-page-btn nav-step';
        nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
        pagination.appendChild(nextBtn);
    }

    function goToPage(page) {
        currentPage = page;
        const articles = window.BORA_BLOG_ARTICLES || [];
        const grid = document.getElementById('blogGrid');
        const pagination = document.getElementById('blogPagination');
        const standbyState = document.getElementById('blogStandbyState');

        // Update URL query parameter cleanly without reloading
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        window.history.pushState({}, '', url);

        renderArticles(articles, grid, standbyState);
        renderPagination(articles, pagination);

        // Smooth scroll back to top of the surface
        const surface = document.querySelector('.blog-editorial-surface');
        if (surface) {
            surface.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function escapeHtml(string) {
        if (!string) return '';
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    }

    // Auto-run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlog);
    } else {
        initBlog();
    }
})();
