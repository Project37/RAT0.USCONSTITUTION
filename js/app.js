// Main application functionality
class ConstitutionApp {
    constructor() {
        this.constitutionData = null;
        this.init();
    }

    async init() {
        try {
            // Load constitution data
            await this.loadConstitutionData();
            
            // Initialize UI components
            this.initNavigation();
            this.renderContent();
            
            // Initialize search functionality
            if (window.ConstitutionSearch) {
                new ConstitutionSearch(this.constitutionData);
            }
            
            // Initialize PWA functionality
            if (window.PWAManager) {
                new PWAManager();
            }
            
            console.log('Constitution App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load the Constitution data. Please refresh the page.');
        }
    }

    async loadConstitutionData() {
        try {
            const response = await fetch('data/constitution.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.constitutionData = await response.json();
        } catch (error) {
            // Fallback to basic structure if JSON file doesn't exist yet
            console.warn('Constitution data file not found, using fallback data');
            this.constitutionData = this.getFallbackData();
        }
    }

    getFallbackData() {
        return {
            preamble: "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.",
            articles: [
                {
                    number: 1,
                    title: "Article I - Legislative Branch",
                    sections: [
                        {
                            number: 1,
                            title: "Legislative Powers",
                            content: "All legislative Powers herein granted shall be vested in a Congress of the United States, which shall consist of a Senate and House of Representatives."
                        }
                    ]
                }
            ],
            amendments: [
                {
                    number: 1,
                    title: "First Amendment - Freedom of Religion, Speech, Press, Assembly, Petition",
                    content: "Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances."
                }
            ]
        };
    }

    initNavigation() {
        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Close mobile nav when clicking on links
            navLinks.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    navLinks.classList.remove('active');
                }
            });

            // Close mobile nav when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                }
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    renderContent() {
        this.renderArticles();
        this.renderAmendments();
    }

    renderArticles() {
        const articlesContainer = document.getElementById('articlesContainer');
        if (!articlesContainer || !this.constitutionData.articles) return;

        articlesContainer.innerHTML = '';

        this.constitutionData.articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            articlesContainer.appendChild(articleElement);
        });
    }

    renderAmendments() {
        const amendmentsContainer = document.getElementById('amendmentsContainer');
        if (!amendmentsContainer || !this.constitutionData.amendments) return;

        amendmentsContainer.innerHTML = '';

        this.constitutionData.amendments.forEach(amendment => {
            const amendmentElement = this.createAmendmentElement(amendment);
            amendmentsContainer.appendChild(amendmentElement);
        });
    }

    createArticleElement(article) {
        const articleDiv = document.createElement('div');
        articleDiv.className = 'content-card';
        articleDiv.id = `article-${article.number}`;

        let sectionsHtml = '';
        if (article.sections && article.sections.length > 0) {
            sectionsHtml = article.sections.map(section => `
                <div class="section">
                    <h4 class="section-title">Section ${section.number}: ${section.title}</h4>
                    <p class="section-content">${section.content}</p>
                </div>
            `).join('');
        }

        articleDiv.innerHTML = `
            <h3 class="article-title">${article.title}</h3>
            <div class="article-content">
                ${sectionsHtml || `<p>${article.content || 'Content loading...'}</p>`}
            </div>
        `;

        return articleDiv;
    }

    createAmendmentElement(amendment) {
        const amendmentDiv = document.createElement('div');
        amendmentDiv.className = 'content-card';
        amendmentDiv.id = `amendment-${amendment.number}`;

        amendmentDiv.innerHTML = `
            <h3 class="amendment-title">Amendment ${amendment.number}</h3>
            <h4 class="amendment-subtitle">${amendment.title}</h4>
            <div class="amendment-content">
                <p>${amendment.content}</p>
            </div>
        `;

        return amendmentDiv;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background-color: #fee2e2;
            color: #dc2626;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem;
            text-align: center;
            border: 1px solid #fca5a5;
        `;
        errorDiv.textContent = message;

        const main = document.querySelector('.main');
        main.insertBefore(errorDiv, main.firstChild);
    }

    // Utility method to get constitution data
    getConstitutionData() {
        return this.constitutionData;
    }

    // Method to highlight text (useful for search results)
    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.constitutionApp = new ConstitutionApp();
});

// Handle browser navigation
window.addEventListener('popstate', (e) => {
    if (e.state && e.state.section) {
        const section = document.getElementById(e.state.section);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        if (searchInput && document.activeElement === searchInput) {
            searchInput.blur();
        }
        if (searchResults && !searchResults.classList.contains('hidden')) {
            searchResults.classList.add('hidden');
        }
    }
});