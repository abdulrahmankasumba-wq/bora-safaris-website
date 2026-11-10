/* ============================================================
   SAFARI PACKAGES DIRECTORY — Filtering Logic & Layout Toggle
   Supports 3 Destination Sections (Uganda, Rwanda, Combined)
   List View and Card View with Smooth Sliding Transitions
   Bora East Africa Safaris
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const packagesList = document.getElementById('packages-list-container');
    if (!packagesList) return;

    // Both list rows and card items
    const listItems    = Array.from(packagesList.querySelectorAll('.pkg-dir-row'));
    const cardItems    = Array.from(packagesList.querySelectorAll('.pkg-card-item'));
    const countDisplay = document.getElementById('pkg-count-display');
    const noResults    = document.getElementById('pkg-no-results');

    // --- Layout View Toggle elements ---
    const viewToggleList  = document.getElementById('view-toggle-list');
    const viewToggleCards = document.getElementById('view-toggle-cards');
    const listContainers  = Array.from(document.querySelectorAll('.pkg-category-list'));
    const cardsContainers = Array.from(document.querySelectorAll('.pkg-category-cards'));
    let currentView       = 'list';
    let isAnimating       = false;

    // --- Filter toggle button & panel ---
    const toggleBtn    = document.getElementById('pkg-filter-toggle-btn');
    const panel        = document.getElementById('pkg-filter-panel');
    const closeBtn     = document.getElementById('pkg-filter-close');
    const activeBadge  = document.getElementById('pkg-active-badge');
    const activeChips  = document.getElementById('pkg-active-chips');

    // --- Option buttons inside the panel ---
    const categoryBtns = Array.from(document.querySelectorAll('.pkg-opt-btn[data-filter-type="category"]'));
    const durationBtns = Array.from(document.querySelectorAll('.pkg-opt-btn[data-filter-type="duration"]'));
    const searchInput  = document.getElementById('pkg-search-input');
    const searchClear  = document.getElementById('pkg-search-clear');
    const resetBtn     = document.getElementById('pkg-reset-filters-btn');
    const applyBtn     = document.getElementById('pkg-filter-apply-btn');

    // --- Filter State ---
    let currentCategory   = 'all';
    let currentDuration   = 'all';
    let currentSearch     = '';
    let panelOpen         = false;

    /* ============================================================
       1. PANEL OPEN / CLOSE LOGIC
       ============================================================ */
    function openPanel() {
        panel.style.display = 'block';
        toggleBtn.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
        panelOpen = true;
    }

    function closePanel() {
        panel.style.display = 'none';
        toggleBtn.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        panelOpen = false;
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        panelOpen ? closePanel() : openPanel();
    });

    closeBtn.addEventListener('click', closePanel);

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (panelOpen && !panel.contains(e.target) && !toggleBtn.contains(e.target)) {
            closePanel();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panelOpen) closePanel();
    });

    /* ============================================================
       2. FILTER APPLICATION LOGIC (Applies to List AND Card Views)
       ============================================================ */
    function applyFilters() {
        let visible = 0;

        listItems.forEach(item => {
            const id       = item.id;
            const cat      = item.getAttribute('data-category');
            const dur      = item.getAttribute('data-duration');
            const keywords = (item.getAttribute('data-keywords') || '').toLowerCase();

            const matchCat    = currentCategory === 'all' || cat === currentCategory;
            const matchDur    = currentDuration === 'all' || dur === currentDuration;
            const matchSearch = !currentSearch || keywords.includes(currentSearch);

            const card = document.getElementById('card-' + id);

            if (matchCat && matchDur && matchSearch) {
                item.classList.remove('pkg-hidden');
                if (card) card.classList.remove('pkg-hidden');
                visible++;
            } else {
                item.classList.add('pkg-hidden');
                if (card) card.classList.add('pkg-hidden');
            }
        });

        // Hide or show category sections based on whether they contain visible rows
        document.querySelectorAll('.pkg-category-group').forEach(group => {
            const visibleInGroup = group.querySelectorAll('.pkg-dir-row:not(.pkg-hidden)').length;
            group.style.display = visibleInGroup === 0 ? 'none' : 'block';
        });

        if (countDisplay) {
            countDisplay.innerHTML = `Showing <strong>${visible}</strong> of <strong>${listItems.length}</strong> safari packages`;
        }

        if (noResults) {
            noResults.style.display = visible === 0 ? 'block' : 'none';
        }

        updateBadgeAndChips();
    }

    /* ============================================================
       3. VIEW TOGGLE LOGIC & SLIDING ANIMATIONS
       ============================================================ */
    function switchView(targetView) {
        if (targetView === currentView || isAnimating) return;
        isAnimating = true;

        if (targetView === 'cards') {
            // --- Transition: List View to Card View ---
            // 1. Update toggle button active state
            if (viewToggleList) {
                viewToggleList.classList.remove('active');
                viewToggleList.setAttribute('aria-pressed', 'false');
            }
            if (viewToggleCards) {
                viewToggleCards.classList.add('active');
                viewToggleCards.setAttribute('aria-pressed', 'true');
            }

            // 2. Animate out the existing list smoothly to the left
            listContainers.forEach(el => {
                el.classList.remove('view-anim-in-left');
                el.classList.add('view-anim-out-left');
            });

            // 3. Reveal card view sliding in from right to left with progressive stagger
            setTimeout(() => {
                listContainers.forEach(el => {
                    el.style.display = 'none';
                    el.classList.remove('view-anim-out-left');
                });

                cardsContainers.forEach(el => {
                    el.style.display = 'grid';
                    el.classList.remove('view-anim-out-right');
                    el.classList.add('view-anim-in-right');
                });

                // Progressive staggered entrance for visible cards from right to left
                const visibleCards = Array.from(document.querySelectorAll('.pkg-card-item:not(.pkg-hidden)'));
                visibleCards.forEach((card, index) => {
                    card.style.animationDelay = `${Math.min(index * 35, 320)}ms`;
                    card.classList.add('anim-card-stagger');
                });

                currentView = 'cards';
                isAnimating = false;
            }, 190);
        } else {
            // --- Transition: Card View to List View ---
            // 1. Update toggle button active state
            if (viewToggleCards) {
                viewToggleCards.classList.remove('active');
                viewToggleCards.setAttribute('aria-pressed', 'false');
            }
            if (viewToggleList) {
                viewToggleList.classList.add('active');
                viewToggleList.setAttribute('aria-pressed', 'true');
            }

            // 2. Animate out the cards smoothly to the right
            cardsContainers.forEach(el => {
                el.classList.remove('view-anim-in-right');
                el.classList.add('view-anim-out-right');
            });

            // 3. Reveal list view sliding in from left to right
            setTimeout(() => {
                cardsContainers.forEach(el => {
                    el.style.display = 'none';
                    el.classList.remove('view-anim-out-right');
                    el.querySelectorAll('.pkg-card-item').forEach(c => {
                        c.classList.remove('anim-card-stagger');
                        c.style.animationDelay = '';
                    });
                });

                listContainers.forEach(el => {
                    el.style.display = 'flex';
                    el.classList.remove('view-anim-out-left');
                    el.classList.add('view-anim-in-left');
                });

                currentView = 'list';
                isAnimating = false;
            }, 190);
        }
    }

    if (viewToggleList) {
        viewToggleList.addEventListener('click', () => switchView('list'));
    }
    if (viewToggleCards) {
        viewToggleCards.addEventListener('click', () => switchView('cards'));
    }

    /* ============================================================
       4. BADGE & ACTIVE-FILTER CHIPS
       ============================================================ */
    const LABELS = {
        category: { all: null, uganda: 'Uganda', rwanda: 'Rwanda', combined: 'Combined' },
        duration:  { all: null, short: '2–4 Days', medium: '5–8 Days', long: '9+ Days' },
    };

    function updateBadgeAndChips() {
        const chips = [];
        if (currentCategory !== 'all') chips.push({ type: 'category', value: currentCategory, label: LABELS.category[currentCategory] });
        if (currentDuration  !== 'all') chips.push({ type: 'duration',  value: currentDuration,  label: LABELS.duration[currentDuration] });
        if (currentSearch)               chips.push({ type: 'search',    value: currentSearch,    label: `"${currentSearch}"` });

        const count = chips.length;

        // Badge on toggle button
        if (activeBadge) {
            activeBadge.textContent = count;
            activeBadge.style.display = count > 0 ? 'inline-flex' : 'none';
        }

        // Chips strip beside the button
        if (activeChips) {
            activeChips.innerHTML = chips.map(c => `
                <span class="pkg-chip">
                    ${c.label}
                    <button class="pkg-chip__remove" data-chip-type="${c.type}" title="Remove filter" aria-label="Remove ${c.label} filter">
                        <i class="fas fa-times"></i>
                    </button>
                </span>`).join('');

            // Chip remove buttons
            activeChips.querySelectorAll('.pkg-chip__remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const t = btn.getAttribute('data-chip-type');
                    if (t === 'category') resetCategory();
                    if (t === 'duration')  resetDuration();
                    if (t === 'search')    resetSearch();
                    applyFilters();
                });
            });
        }
    }

    /* ============================================================
       5. INDIVIDUAL RESET HELPERS & EVENT LISTENERS
       ============================================================ */
    function resetCategory() {
        currentCategory = 'all';
        categoryBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-value') === 'all'));
    }

    function resetDuration() {
        currentDuration = 'all';
        durationBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-value') === 'all'));
    }

    function resetSearch() {
        currentSearch = '';
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.style.display = 'none';
    }

    /* ---- Category options ---- */
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-value') || 'all';
        });
    });

    /* ---- Duration options ---- */
    durationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            durationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDuration = btn.getAttribute('data-value') || 'all';
        });
    });

    /* ---- Search input ---- */
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.trim().toLowerCase();
            if (searchClear) searchClear.style.display = currentSearch ? 'inline-flex' : 'none';
        });
    }

    if (searchClear) {
        searchClear.addEventListener('click', () => {
            resetSearch();
        });
    }

    /* ---- Apply button (closes panel and applies) ---- */
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFilters();
            closePanel();
        });
    }

    /* ---- Reset All ---- */
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetCategory();
            resetDuration();
            resetSearch();
            applyFilters();
        });
    }

    // Wire up "Reset All Filters" inside the no-results box
    const noResultsReset = document.querySelector('.pkg-no-results-reset');
    if (noResultsReset) {
        noResultsReset.addEventListener('click', () => {
            resetCategory();
            resetDuration();
            resetSearch();
            applyFilters();
        });
    }

    // Initial render
    applyFilters();
});