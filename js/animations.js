/**
 * animations.js
 * - Scroll-in fade/slide animations for .animate-in cards
 * - TOC active-link tracking as user scrolls through sections/cards
 */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       Scroll-in animations (IntersectionObserver)
       ---------------------------------------------------------- */
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-in');
        if (!elements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, i) => {
                    if (entry.isIntersecting) {
                        // Stagger delay based on sibling index within its parent
                        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.animate-in'));
                        const idx = siblings.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        elements.forEach((el) => observer.observe(el));
    }

    /* ----------------------------------------------------------
       TOC active-link tracking
       ---------------------------------------------------------- */
    function initTOCTracking() {
        const tocLinks = document.querySelectorAll('.toc-list a');
        if (!tocLinks.length) return;

        // Build a map of id -> anchor element
        const anchorMap = new Map();
        tocLinks.forEach((link) => {
            const id = link.getAttribute('href').replace('#', '');
            anchorMap.set(id, link);
        });

        // Collect all trackable section/card elements in DOM order
        const tracked = [];
        anchorMap.forEach((_, id) => {
            const el = document.getElementById(id);
            if (el) tracked.push(el);
        });

        if (!tracked.length) return;

        const headerHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '72',
            10
        );

        function setActive(id) {
            tocLinks.forEach((link) => link.classList.remove('active'));
            const active = anchorMap.get(id);
            if (active) {
                active.classList.add('active');
                // Scroll TOC to keep active link in view
                const sidebar = document.querySelector('.toc-sidebar');
                if (sidebar) {
                    const linkTop = active.offsetTop - sidebar.offsetTop;
                    const sidebarMid = sidebar.scrollTop + sidebar.clientHeight / 2;
                    if (linkTop < sidebar.scrollTop || linkTop > sidebarMid) {
                        sidebar.scrollTo({ top: linkTop - 40, behavior: 'smooth' });
                    }
                }
            }
        }

        // Use IntersectionObserver to track which section is visible
        const tocObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            {
                rootMargin: `-${headerHeight + 20}px 0px -60% 0px`,
                threshold: 0,
            }
        );

        tracked.forEach((el) => tocObserver.observe(el));
    }

    /* ----------------------------------------------------------
       Active nav-link highlighting
       ---------------------------------------------------------- */
    function initNavHighlight() {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        if (!navLinks.length) return;

        const sectionIds = ['preamble', 'articles', 'amendments', 'search'];
        const headerHeight = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '72',
            10
        );

        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        navLinks.forEach((link) => {
                            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                        });
                    }
                });
            },
            { rootMargin: `-${headerHeight}px 0px -70% 0px`, threshold: 0 }
        );

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (el) navObserver.observe(el);
        });
    }

    /* ----------------------------------------------------------
       Boot: wait for dynamic content to be rendered
       ---------------------------------------------------------- */
    function boot() {
        // app.js renders articles/amendments asynchronously; poll briefly
        let attempts = 0;
        const maxAttempts = 20;

        function tryInit() {
            const cards = document.querySelectorAll('.animate-in');
            if (cards.length > 0 || attempts >= maxAttempts) {
                initScrollAnimations();
                initTOCTracking();
                initNavHighlight();
            } else {
                attempts++;
                setTimeout(tryInit, 150);
            }
        }

        tryInit();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
