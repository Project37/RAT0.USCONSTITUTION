// Search functionality for the Constitution
class ConstitutionSearch {
    constructor(constitutionData) {
        this.data = constitutionData;
        this.searchIndex = this.buildSearchIndex();
        this.init();
    }

    init() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const searchResults = document.getElementById('searchResults');

        if (!searchInput || !searchBtn || !searchResults) {
            console.error('Search elements not found');
            return;
        }

        // Debounce search to avoid too many API calls
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                searchResults.classList.add('hidden');
                return;
            }
            
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 300);
        });

        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                this.performSearch(query);
            }
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            }
        });

        // Handle result selection with keyboard
        searchInput.addEventListener('keydown', (e) => {
            const results = searchResults.querySelectorAll('.search-result-item');
            let selectedIndex = -1;
            
            results.forEach((result, index) => {
                if (result.classList.contains('selected')) {
                    selectedIndex = index;
                }
            });

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (selectedIndex < results.length - 1) {
                    if (selectedIndex >= 0) {
                        results[selectedIndex].classList.remove('selected');
                    }
                    selectedIndex++;
                    results[selectedIndex].classList.add('selected');
                    results[selectedIndex].scrollIntoView({ block: 'nearest' });
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (selectedIndex > 0) {
                    results[selectedIndex].classList.remove('selected');
                    selectedIndex--;
                    results[selectedIndex].classList.add('selected');
                    results[selectedIndex].scrollIntoView({ block: 'nearest' });
                } else if (selectedIndex === 0) {
                    results[selectedIndex].classList.remove('selected');
                    searchInput.focus();
                }
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                results[selectedIndex].click();
            }
        });
    }

    buildSearchIndex() {
        const index = [];
        
        // Index preamble
        if (this.data.preamble) {
            index.push({
                type: 'preamble',
                title: 'Preamble',
                content: this.data.preamble,
                id: 'preamble'
            });
        }

        // Index articles
        if (this.data.articles) {
            this.data.articles.forEach(article => {
                index.push({
                    type: 'article',
                    title: article.title,
                    content: this.extractArticleText(article),
                    id: `article-${article.number}`,
                    number: article.number
                });

                // Index sections within articles
                if (article.sections) {
                    article.sections.forEach(section => {
                        index.push({
                            type: 'section',
                            title: `${article.title} - Section ${section.number}: ${section.title}`,
                            content: section.content,
                            id: `article-${article.number}`,
                            parentTitle: article.title,
                            sectionNumber: section.number
                        });
                    });
                }
            });
        }

        // Index amendments
        if (this.data.amendments) {
            this.data.amendments.forEach(amendment => {
                index.push({
                    type: 'amendment',
                    title: `Amendment ${amendment.number}: ${amendment.title}`,
                    content: amendment.content,
                    id: `amendment-${amendment.number}`,
                    number: amendment.number
                });
            });
        }

        return index;
    }

    extractArticleText(article) {
        let text = '';
        if (article.content) {
            text += article.content + ' ';
        }
        if (article.sections) {
            text += article.sections.map(section => section.content).join(' ');
        }
        return text.trim();
    }

    performSearch(query) {
        const results = this.searchIndex.filter(item => 
            this.matchesQuery(item, query)
        ).sort((a, b) => {
            // Sort by relevance (title matches first, then content matches)
            const aTitle = this.getRelevanceScore(a.title, query);
            const bTitle = this.getRelevanceScore(b.title, query);
            const aContent = this.getRelevanceScore(a.content, query);
            const bContent = this.getRelevanceScore(b.content, query);
            
            return (bTitle * 2 + bContent) - (aTitle * 2 + aContent);
        });

        this.displayResults(results, query);
    }

    matchesQuery(item, query) {
        const searchTerms = query.toLowerCase().split(/\s+/);
        const titleText = item.title.toLowerCase();
        const contentText = item.content.toLowerCase();
        
        return searchTerms.some(term => 
            titleText.includes(term) || contentText.includes(term)
        );
    }

    getRelevanceScore(text, query) {
        const textLower = text.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Exact phrase match gets highest score
        if (textLower.includes(queryLower)) {
            return 10;
        }
        
        // Word matches
        const searchTerms = queryLower.split(/\s+/);
        let score = 0;
        
        searchTerms.forEach(term => {
            if (textLower.includes(term)) {
                score += 1;
                // Bonus for word boundaries
                if (new RegExp(`\\b${term}\\b`).test(textLower)) {
                    score += 2;
                }
            }
        });
        
        return score;
    }

    displayResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-title">No results found</div>
                    <div class="search-result-excerpt">
                        Try searching for different terms or phrases.
                    </div>
                </div>
            `;
        } else {
            searchResults.innerHTML = results.slice(0, 10).map(result => 
                this.createResultElement(result, query)
            ).join('');
        }
        
        searchResults.classList.remove('hidden');
        
        // Add click handlers to results
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.dataset.targetId;
                this.navigateToResult(targetId);
            });
        });
    }

    createResultElement(result, query) {
        const excerpt = this.createExcerpt(result.content, query);
        const highlightedTitle = this.highlightText(result.title, query);
        const highlightedExcerpt = this.highlightText(excerpt, query);
        
        return `
            <div class="search-result-item" data-target-id="${result.id}">
                <div class="search-result-title">${highlightedTitle}</div>
                <div class="search-result-excerpt">${highlightedExcerpt}</div>
            </div>
        `;
    }

    createExcerpt(content, query, maxLength = 150) {
        const queryLower = query.toLowerCase();
        const contentLower = content.toLowerCase();
        
        // Find the position of the first match
        let matchIndex = contentLower.indexOf(queryLower);
        if (matchIndex === -1) {
            // If no exact phrase match, find first word match
            const searchTerms = queryLower.split(/\s+/);
            for (const term of searchTerms) {
                matchIndex = contentLower.indexOf(term);
                if (matchIndex !== -1) break;
            }
        }
        
        if (matchIndex === -1) {
            // No match found, return beginning of content
            return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
        }
        
        // Create excerpt around the match
        const start = Math.max(0, matchIndex - Math.floor(maxLength / 3));
        const end = Math.min(content.length, start + maxLength);
        
        let excerpt = content.substring(start, end);
        
        if (start > 0) excerpt = '...' + excerpt;
        if (end < content.length) excerpt = excerpt + '...';
        
        return excerpt;
    }

    highlightText(text, query) {
        if (!query) return text;
        
        const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
        let highlightedText = text;
        
        searchTerms.forEach(term => {
            const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        return highlightedText;
    }

    navigateToResult(targetId) {
        const searchResults = document.getElementById('searchResults');
        const searchInput = document.getElementById('searchInput');
        
        // Hide search results
        searchResults.classList.add('hidden');
        
        // Clear search input focus
        searchInput.blur();
        
        // Navigate to target
        const target = document.getElementById(targetId);
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Add a temporary highlight to the target
            target.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
            target.style.transition = 'box-shadow 0.3s ease';
            
            setTimeout(() => {
                target.style.boxShadow = '';
                setTimeout(() => {
                    target.style.transition = '';
                }, 300);
            }, 2000);
            
            // Update browser history
            history.pushState({ section: targetId }, '', `#${targetId}`);
        }
    }

    // Public method to clear search results
    clearResults() {
        const searchResults = document.getElementById('searchResults');
        const searchInput = document.getElementById('searchInput');
        
        if (searchResults) {
            searchResults.classList.add('hidden');
        }
        if (searchInput) {
            searchInput.value = '';
        }
    }
}

// Make ConstitutionSearch available globally
window.ConstitutionSearch = ConstitutionSearch;