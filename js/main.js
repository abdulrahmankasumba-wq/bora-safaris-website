document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const header = document.querySelector('.header');
            navLinks.classList.toggle('active');
            header.classList.toggle('menu-active');

            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close menu on click
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Lightbox Functionality
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

    if (galleryItems.length > 0) {
        // Create Lightbox Elements
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';

        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-lightbox';
        closeBtn.innerHTML = '&times;';

        const lightboxImg = document.createElement('img');
        lightboxImg.className = 'lightbox-content';
        lightboxImg.id = 'lightbox-img';

        lightbox.appendChild(closeBtn);
        lightbox.appendChild(lightboxImg);
        document.body.appendChild(lightbox);

        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');

        let currentIndex = 0;

        const updateImage = (index) => {
            if (index >= 0 && index < galleryItems.length) {
                const img = galleryItems[index].querySelector('img');
                if (img) {
                    lightboxImg.style.opacity = '0';
                    setTimeout(() => {
                        lightboxImg.src = img.src;
                        lightboxImg.style.opacity = '1';
                    }, 150);
                    currentIndex = index;
                }
            }
        };

        const openLightbox = (index) => {
            lightbox.value = 'open'; // State flag
            lightbox.style.display = 'block';
            updateImage(index);

            // Apply blur
            if (mainContent) mainContent.classList.add('blur-content');
            if (header) header.classList.add('blur-content');
            if (footer) footer.classList.add('blur-content');
            document.body.style.overflow = 'hidden';
        };

        const closeBox = () => {
            lightbox.style.display = 'none';
            if (mainContent) mainContent.classList.remove('blur-content');
            if (header) header.classList.remove('blur-content');
            if (footer) footer.classList.remove('blur-content');
            document.body.style.overflow = 'auto';
        };

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        });

        // Navigation Functions
        const showNext = () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= galleryItems.length) nextIndex = 0; // Loop
            updateImage(nextIndex);
        };

        const showPrev = () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = galleryItems.length - 1; // Loop
            updateImage(prevIndex);
        };

        // Event Listeners
        closeBtn.onclick = closeBox;
        lightbox.onclick = (e) => {
            if (e.target !== lightboxImg) {
                closeBox();
            }
        };

        // Keyboard Navigation (Arrows & Escape)
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'block') {
                if (e.key === 'Escape') closeBox();
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') showNext();
                if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') showPrev();
            }
        });

        // Mouse Wheel Navigation
        lightbox.addEventListener('wheel', (e) => {
            e.preventDefault(); // Prevent page scroll
            if (e.deltaY > 0) {
                showNext();
            } else {
                showPrev();
            }
        }, { passive: false });
    }

    // Hero Background Slideshow
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 0) {
        let currentSlideIndex = 0;
        
        setInterval(() => {
            const prevIndex = currentSlideIndex;
            
            // Mark current slide to exit (fade out and slide left)
            slides[prevIndex].classList.remove('active');
            slides[prevIndex].classList.add('exit');
            
            // Wait for transition to complete before resetting the exit class
            setTimeout(() => {
                slides[prevIndex].classList.remove('exit');
            }, 1500);
            
            // Move to next slide (fade in and slide to center)
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }, 7000);
    }

    // Tours Carousel — single-card step with edge fading
    const carouselTrack = document.querySelector('.tours-carousel-track');
    const prevBtn = document.getElementById('tours-prev');
    const nextBtn = document.getElementById('tours-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (carouselTrack && prevBtn && nextBtn) {
        const cards = Array.from(carouselTrack.querySelectorAll('.tour-card'));
        let currentIndex = 0; // index of the first visible card
        let isAnimating = false;

        const getVisibleCount = () => {
            const w = window.innerWidth;
            if (w <= 768) return 1;
            if (w <= 1024) return 2;
            return 3;
        };

        const getMaxIndex = () => Math.max(0, cards.length - getVisibleCount());

        // Calculate pixel offset for a given start index
        const getOffset = (index) => {
            if (index <= 0 || !cards[0]) return 0;
            const gap = parseFloat(getComputedStyle(carouselTrack).gap) || 0;
            const cardWidth = cards[0].offsetWidth;
            return index * (cardWidth + gap);
        };

        const updateButtons = () => {
            prevBtn.classList.toggle('disabled', currentIndex <= 0);
            nextBtn.classList.toggle('disabled', currentIndex >= getMaxIndex());
        };

        // Build / update dots
        const buildDots = () => {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const max = getMaxIndex();
            for (let i = 0; i <= max; i++) {
                const dot = document.createElement('button');
                dot.className = 'dot' + (i === currentIndex ? ' active' : '');
                dot.setAttribute('aria-label', `Position ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }
        };

        const updateDots = () => {
            if (!dotsContainer) return;
            dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        };

        // Move by a single step with edge-card fading
        const step = (direction) => {
            if (isAnimating) return;
            const maxIdx = getMaxIndex();
            const visible = getVisibleCount();
            let targetIndex;

            if (direction === 'next') {
                targetIndex = currentIndex + 1;
                if (targetIndex > maxIdx) return;
            } else {
                targetIndex = currentIndex - 1;
                if (targetIndex < 0) return;
            }

            isAnimating = true;

            // Determine which card is leaving and which is entering
            let leavingCard, enteringCard;

            if (direction === 'next') {
                leavingCard = cards[currentIndex];
                enteringCard = cards[currentIndex + visible];
            } else {
                leavingCard = cards[currentIndex + visible - 1];
                enteringCard = cards[targetIndex];
            }

            // Start the leaving card fade out
            if (leavingCard) leavingCard.classList.add('fade-out');

            // Prepare entering card invisible
            if (enteringCard) enteringCard.classList.add('fade-in');

            // Slide the track smoothly
            currentIndex = targetIndex;
            const offset = getOffset(currentIndex);
            carouselTrack.style.transform = `translateX(-${offset}px)`;

            // After a brief delay, fade in the entering card
            setTimeout(() => {
                if (enteringCard) {
                    enteringCard.classList.remove('fade-in');
                    enteringCard.classList.add('fade-in-active');
                }
            }, 50);

            // Clean up after transition ends
            setTimeout(() => {
                if (leavingCard) leavingCard.classList.remove('fade-out');
                if (enteringCard) enteringCard.classList.remove('fade-in', 'fade-in-active');
                isAnimating = false;
                updateDots();
                updateButtons();
            }, 700);
        };

        // Jump to an arbitrary index (for dot clicks)
        const goTo = (targetIndex) => {
            if (isAnimating || targetIndex === currentIndex) return;
            isAnimating = true;
            currentIndex = Math.max(0, Math.min(targetIndex, getMaxIndex()));
            const offset = getOffset(currentIndex);
            carouselTrack.style.transform = `translateX(-${offset}px)`;
            setTimeout(() => {
                isAnimating = false;
                updateDots();
                updateButtons();
            }, 700);
        };

        // Button handlers
        prevBtn.addEventListener('click', () => step('prev'));
        nextBtn.addEventListener('click', () => step('next'));

        // Initialize
        buildDots();
        updateButtons();

        // Recalculate on resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const maxIdx = getMaxIndex();
                if (currentIndex > maxIdx) currentIndex = maxIdx;
                carouselTrack.style.transition = 'none';
                carouselTrack.style.transform = `translateX(-${getOffset(currentIndex)}px)`;
                carouselTrack.offsetHeight;
                carouselTrack.style.transition = '';
                buildDots();
                updateButtons();
            }, 200);
        });
    }

    // Card Image Sliders (for tours.html)
    const cardSliders = document.querySelectorAll('.card-slider');
    cardSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slider-slides img');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const dots = slider.querySelectorAll('.slider-dots .dot');
        let activeIndex = 0;

        if (slides.length <= 1) return;

        const showSlide = (index) => {
            slides[activeIndex].classList.remove('active');
            if (dots[activeIndex]) dots[activeIndex].classList.remove('active');
            
            activeIndex = (index + slides.length) % slides.length;
            
            slides[activeIndex].classList.add('active');
            if (dots[activeIndex]) dots[activeIndex].classList.add('active');
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(activeIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(activeIndex + 1);
            });
        }

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showSlide(dotIndex);
            });
        });
    });

    // Destination Guides Filter & Switcher (Uganda / Rwanda)
    const destTabs = document.querySelectorAll('.dest-tab-btn');
    const destViews = document.querySelectorAll('.dest-view');

    if (destTabs.length > 0 && destViews.length > 0) {
        const switchDestination = (targetId, shouldScroll = false) => {
            destTabs.forEach(tab => {
                const target = tab.getAttribute('data-target');
                tab.classList.toggle('active', target === targetId);
            });

            destViews.forEach(view => {
                if (view.id === targetId) {
                    view.classList.remove('hidden');
                    view.classList.add('active-view');
                    const cards = view.querySelectorAll('.article-card, .country-card');
                    cards.forEach(card => card.classList.add('visible'));
                } else {
                    view.classList.add('hidden');
                    view.classList.remove('active-view');
                }
            });

            if (shouldScroll) {
                const guidesSec = document.getElementById('guides');
                if (guidesSec) {
                    guidesSec.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        destTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.getAttribute('data-target');
                switchDestination(targetId, false);
            });
        });

        document.querySelectorAll('[data-dest-trigger]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.getAttribute('data-dest-trigger');
                switchDestination(targetId, true);
            });
        });

        const checkHash = () => {
            const hash = window.location.hash.toLowerCase();
            if (hash === '#uganda' || hash === '#dest-uganda') {
                switchDestination('dest-uganda', true);
            } else if (hash === '#rwanda' || hash === '#dest-rwanda') {
                switchDestination('dest-rwanda', true);
            } else if (hash === '#all' || hash === '#dest-all') {
                switchDestination('dest-all', false);
            }
        };

        checkHash();
        window.addEventListener('hashchange', checkHash);
    }

    // Top Packages Horizontal Gallery Controller
    const topPackagesTrack = document.getElementById('topPackagesTrack');
    const topPackagesGalleryCol = document.querySelector('.top-packages-gallery-col');
    const topPackagesPrev = document.querySelector('.top-packages-arrow-prev');
    const topPackagesNext = document.querySelector('.top-packages-arrow-next');

    if (topPackagesTrack && topPackagesPrev && topPackagesNext) {
        const packageCards = topPackagesTrack.querySelectorAll('.top-package-card');

        const updatePackageGalleryControls = () => {
            const scrollLeft = topPackagesTrack.scrollLeft;
            const maxScroll = topPackagesTrack.scrollWidth - topPackagesTrack.clientWidth;

            topPackagesPrev.disabled = scrollLeft <= 8;
            topPackagesNext.disabled = scrollLeft >= maxScroll - 8;

            // Toggle blurred exit transition under introduction
            if (topPackagesGalleryCol) {
                if (scrollLeft > 6) {
                    topPackagesGalleryCol.classList.add('is-scrolled');
                } else {
                    topPackagesGalleryCol.classList.remove('is-scrolled');
                }
            }
        };

        const scrollBySet = (direction) => {
            const firstCard = topPackagesTrack.querySelector('.top-package-card');
            const gap = 22;
            const cardWidth = firstCard ? firstCard.offsetWidth : 300;
            // On desktop (3 cards visible), scroll by 3 cards; on smaller screens by 1 card
            const scrollAmount = topPackagesTrack.clientWidth > 700 
                ? (cardWidth + gap) * 3 
                : (cardWidth + gap);

            topPackagesTrack.scrollBy({
                left: scrollAmount * direction,
                behavior: 'smooth'
            });
        };

        topPackagesPrev.addEventListener('click', (e) => {
            e.preventDefault();
            scrollBySet(-1);
        });

        topPackagesNext.addEventListener('click', (e) => {
            e.preventDefault();
            scrollBySet(1);
        });

        let isScrollTicking = false;
        topPackagesTrack.addEventListener('scroll', () => {
            if (!isScrollTicking) {
                window.requestAnimationFrame(() => {
                    updatePackageGalleryControls();
                    isScrollTicking = false;
                });
                isScrollTicking = true;
            }
        }, { passive: true });

        // Keyboard arrow navigation
        topPackagesTrack.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollBySet(1);
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollBySet(-1);
            }
        });

        // Mouse Drag to Scroll for Desktop
        let isMouseDown = false;
        let startPageX = 0;
        let initialScrollLeft = 0;
        let hasDragged = false;

        topPackagesTrack.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.target.closest('a') || e.target.closest('button')) return;
            isMouseDown = true;
            hasDragged = false;
            topPackagesTrack.classList.add('is-dragging');
            startPageX = e.pageX - topPackagesTrack.offsetLeft;
            initialScrollLeft = topPackagesTrack.scrollLeft;
        });

        const endDrag = () => {
            if (isMouseDown) {
                isMouseDown = false;
                topPackagesTrack.classList.remove('is-dragging');
            }
        };

        topPackagesTrack.addEventListener('mouseleave', endDrag);
        topPackagesTrack.addEventListener('mouseup', endDrag);

        topPackagesTrack.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            e.preventDefault();
            hasDragged = true;
            const currentX = e.pageX - topPackagesTrack.offsetLeft;
            const walk = (currentX - startPageX) * 1.35;
            topPackagesTrack.scrollLeft = initialScrollLeft - walk;
        });

        // Prevent click if user dragged
        topPackagesTrack.addEventListener('click', (e) => {
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
                hasDragged = false;
            }
        }, true);

        window.addEventListener('resize', updatePackageGalleryControls);
        updatePackageGalleryControls();
    }

    /* ============================================================
       SAFARIS NAVIGATION DROPDOWN
       Dynamically populates all 22 safari packages across all pages
       Bora East Africa Safaris
       ============================================================ */
    function initSafarisNavDropdown() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        // Find the Safaris link inside nav
        const safarisLink = Array.from(navLinks.querySelectorAll('a')).find(a => {
            const href = (a.getAttribute('href') || '').toLowerCase();
            const text = a.textContent.trim().toLowerCase();
            return href.endsWith('safaris.html') || href === 'safaris.html' || text === 'safaris';
        });

        if (!safarisLink || safarisLink.closest('.nav-dropdown-wrapper')) return;

        // Determine path prefix based on the existing safaris link href
        const originalHref = safarisLink.getAttribute('href') || 'safaris.html';
        const isSubfolder = originalHref.startsWith('../');
        const packagePrefix = isSubfolder ? '../packages/' : 'packages/';
        const allSafarisHref = originalHref;

        // Complete 22 Safari Packages Data (Uganda, Rwanda, Combined)
        const safariPackages = [
            // Uganda (13)
            {
                id: 1,
                title: '15 Days Uganda Gorilla, Chimpanzee & Big 5 Safari',
                days: '15 Days',
                file: 'package-1.html',
                category: 'uganda'
            },
            {
                id: 2,
                title: '11 Days Best of Uganda Safari',
                days: '11 Days',
                file: 'package-2.html',
                category: 'uganda'
            },
            {
                id: 3,
                title: '8 Days Uganda Gorilla Habituation, Wildlife & Chimpanzee Trekking Safari',
                days: '8 Days',
                file: 'package-3.html',
                category: 'uganda'
            },
            {
                id: 4,
                title: '6 Days Uganda Package – Jinja & Bwindi',
                days: '6 Days',
                file: 'package-4.html',
                category: 'uganda'
            },
            {
                id: 5,
                title: '6 Days Uganda Cultural Tour – Eastern Uganda',
                days: '6 Days',
                file: 'package-5.html',
                category: 'uganda'
            },
            {
                id: 6,
                title: '5 Days Uganda – Kibale & Bwindi Tour',
                days: '5 Days',
                file: 'package-6.html',
                category: 'uganda'
            },
            {
                id: 7,
                title: '5 Days Uganda Primates & Wildlife Safari – Kibale & Queen Elizabeth',
                days: '5 Days',
                file: 'package-7.html',
                category: 'uganda'
            },
            {
                id: 8,
                title: '4 Days Uganda Gorilla & Chimpanzee Trekking Safari',
                days: '4 Days',
                file: 'package-8.html',
                category: 'uganda'
            },
            {
                id: 9,
                title: '3 Days Uganda Gorilla Trekking Safari – Bwindi',
                days: '3 Days',
                file: 'package-9.html',
                category: 'uganda'
            },
            {
                id: 10,
                title: '3 Days Murchison Falls National Park Safari',
                days: '3 Days',
                file: 'package-10.html',
                category: 'uganda'
            },
            {
                id: 11,
                title: '3 Days Queen Elizabeth National Park Safari',
                days: '3 Days',
                file: 'package-11.html',
                category: 'uganda'
            },
            {
                id: 12,
                title: '3 Days Lake Mburo Safari',
                days: '3 Days',
                file: 'package-12.html',
                category: 'uganda'
            },
            {
                id: 13,
                title: '3 Days Kibale Chimpanzee Safari',
                days: '3 Days',
                file: 'package-13.html',
                category: 'uganda'
            },

            // Rwanda (6)
            {
                id: 14,
                title: '10 Days Rwanda Safari – Akagera, Nyungwe, Volcanoes & Lake Kivu',
                days: '10 Days',
                file: 'package-14.html',
                category: 'rwanda'
            },
            {
                id: 15,
                title: '7 Days Rwanda – Nyungwe, Volcanoes & Akagera',
                days: '7 Days',
                file: 'package-15.html',
                category: 'rwanda'
            },
            {
                id: 16,
                title: '7 Days Rwanda – Akagera, Volcanoes & Nyungwe',
                days: '7 Days',
                file: 'package-16.html',
                category: 'rwanda'
            },
            {
                id: 17,
                title: '6 Days Rwanda – Akagera & Volcanoes',
                days: '6 Days',
                file: 'package-17.html',
                category: 'rwanda'
            },
            {
                id: 18,
                title: '3 Days Rwanda Gorilla Trek – Volcanoes',
                days: '3 Days',
                file: 'package-18.html',
                category: 'rwanda'
            },
            {
                id: 19,
                title: '2 Days Akagera National Park',
                days: '2 Days',
                file: 'package-19.html',
                category: 'rwanda'
            },

            // Combined (3)
            {
                id: 20,
                title: '14 Days Uganda–Rwanda Gorilla Safari',
                days: '14 Days',
                file: 'package-20.html',
                category: 'combined'
            },
            {
                id: 21,
                title: '11 Days Rwanda & Uganda Safari',
                days: '11 Days',
                file: 'package-21.html',
                category: 'combined'
            },
            {
                id: 22,
                title: '5 Days Rwanda & Uganda Gorilla Trekking Tour',
                days: '5 Days',
                file: 'package-22.html',
                category: 'combined'
            }
        ];

        // Wrap safarisLink in a dropdown wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'nav-dropdown-wrapper';
        safarisLink.parentNode.insertBefore(wrapper, safarisLink);
        wrapper.appendChild(safarisLink);

        // Configure trigger link
        safarisLink.classList.add('nav-dropdown-trigger');
        safarisLink.setAttribute('aria-expanded', 'false');
        safarisLink.setAttribute('aria-haspopup', 'true');

        // Add dropdown caret
        const caret = document.createElement('i');
        caret.className = 'fas fa-chevron-down nav-dropdown-caret';
        caret.setAttribute('aria-hidden', 'true');
        safarisLink.appendChild(caret);

        // Build dropdown menu container
        const menu = document.createElement('div');
        menu.className = 'nav-dropdown-menu';
        menu.id = 'safaris-nav-dropdown-menu';
        menu.setAttribute('role', 'region');
        menu.setAttribute('aria-label', 'Safari Packages Directory');

        // Header
        const headerEl = document.createElement('div');
        headerEl.className = 'nav-dropdown-header';
        headerEl.innerHTML = `
            <div class="nav-dropdown-header-info">
                <span class="nav-dropdown-header-eyebrow">Explore Bora East Africa Safaris</span>
                <span class="nav-dropdown-header-title">Safari Packages</span>
            </div>
            <span class="nav-dropdown-header-pill">22 Itineraries</span>
        `;
        menu.appendChild(headerEl);

        // Scrollable package list
        const scrollEl = document.createElement('div');
        scrollEl.className = 'nav-dropdown-scroll';

        const categories = [
            { key: 'uganda', title: 'Uganda Safaris', count: 13, icon: 'fas fa-map-marker-alt' },
            { key: 'rwanda', title: 'Rwanda Safaris', count: 6, icon: 'fas fa-mountain' },
            { key: 'combined', title: 'Uganda & Rwanda Combined', count: 3, icon: 'fas fa-globe-africa' }
        ];

        categories.forEach(cat => {
            const groupEl = document.createElement('div');
            groupEl.className = 'nav-dropdown-group';

            const catTitleEl = document.createElement('div');
            catTitleEl.className = 'nav-dropdown-cat-title';
            catTitleEl.innerHTML = `<span><i class="${cat.icon}"></i> ${cat.title}</span><span>${cat.count} Itineraries</span>`;
            groupEl.appendChild(catTitleEl);

            const catPackages = safariPackages.filter(p => p.category === cat.key);
            catPackages.forEach(pkg => {
                const itemEl = document.createElement('a');
                itemEl.href = `${packagePrefix}${pkg.file}`;
                itemEl.className = 'nav-dropdown-item';
                itemEl.innerHTML = `
                    <span class="nav-dropdown-bullet"></span>
                    <span class="nav-dropdown-title">${pkg.title}</span>
                    <span class="nav-dropdown-badge">${pkg.days}</span>
                `;
                groupEl.appendChild(itemEl);
            });

            scrollEl.appendChild(groupEl);
        });

        menu.appendChild(scrollEl);

        // Footer
        const footerEl = document.createElement('div');
        footerEl.className = 'nav-dropdown-footer';
        footerEl.innerHTML = `
            <a href="${allSafarisHref}" class="nav-dropdown-all-btn">
                <span>View All 22 Safari Packages</span>
                <i class="fas fa-arrow-right"></i>
            </a>
        `;
        menu.appendChild(footerEl);

        wrapper.appendChild(menu);

        // Interactive hover behavior with debounce delay
        let closeTimeout = null;

        const openDropdown = () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
                closeTimeout = null;
            }
            wrapper.classList.add('is-open');
            safarisLink.setAttribute('aria-expanded', 'true');
        };

        const closeDropdown = (delay = 200) => {
            if (closeTimeout) clearTimeout(closeTimeout);
            closeTimeout = setTimeout(() => {
                wrapper.classList.remove('is-open');
                safarisLink.setAttribute('aria-expanded', 'false');
            }, delay);
        };

        // Desktop mouse hover events
        wrapper.addEventListener('mouseenter', openDropdown);
        wrapper.addEventListener('mouseleave', () => closeDropdown(200));

        // Keyboard navigation (Tab & Escape)
        wrapper.addEventListener('focusin', openDropdown);
        wrapper.addEventListener('focusout', (e) => {
            if (!wrapper.contains(e.relatedTarget)) {
                closeDropdown(50);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && wrapper.classList.contains('is-open')) {
                closeDropdown(0);
                safarisLink.focus();
            }
        });

        // Touch & Click handling
        let isTouchDevice = false;
        window.addEventListener('touchstart', () => {
            isTouchDevice = true;
        }, { once: true, passive: true });

        safarisLink.addEventListener('click', (e) => {
            // On touch screens (phones/tablets), first tap opens the dropdown
            if (isTouchDevice && !wrapper.classList.contains('is-open')) {
                e.preventDefault();
                openDropdown();
                return;
            }
            // On desktop mouse click or if dropdown already open, normal navigation proceeds
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                closeDropdown(0);
            }
        });
    }

    // Initialize Safari Dropdown
    initSafarisNavDropdown();
});


