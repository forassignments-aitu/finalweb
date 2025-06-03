// Load articles from localStorage or JSON
let articles = JSON.parse(localStorage.getItem('articles')) || window.articlesData.articles;
localStorage.setItem('articles', JSON.stringify(articles));

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Calculate reading time (200 words per minute)
const calculateReadingTime = (wordCount) => {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
};

// Display articles
const articleContainer = document.getElementById('articleContainer');
const mostPopularArticle = document.getElementById('mostPopularArticle');
const sortSelect = document.getElementById('sortSelect');

const displayArticles = () => {
    articleContainer.innerHTML = '';
    // Sort articles
    const sortedArticles = [...articles];
    if (sortSelect.value === 'views') {
        sortedArticles.sort((a, b) => b.views - a.views);
    } else {
        sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Display most popular article
    const mostPopular = sortedArticles[0];
    mostPopularArticle.innerHTML = `
        <h5>${mostPopular.title}</h5>
        <p class="article-meta">${mostPopular.date} | ${mostPopular.category} | ${mostPopular.views} views | ${calculateReadingTime(mostPopular.wordCount)} min read</p>
        <p>${mostPopular.content.substring(0, 100)}...</p>
        <button class="btn btn-primary read-more" data-id="${mostPopular.id}">Read More</button>
    `;

    // Display article cards
    sortedArticles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="article-meta">${article.date} | ${article.category} | ${article.views} views | ${calculateReadingTime(article.wordCount)} min read</p>
                    <p class="card-text">${article.content.substring(0, 100)}...</p>
                    <button class="btn btn-primary read-more" data-id="${article.id}">Read More</button>
                </div>
            </div>
        `;
        articleContainer.appendChild(card);
    });

    // Add event listeners to read more buttons
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', (e) => {
            const articleId = parseInt(e.target.dataset.id);
            const article = articles.find(a => a.id === articleId);
            if (article) {
                // Increment views without refreshing
                article.views += 1;
                localStorage.setItem('articles', JSON.stringify(articles));
                // Update modal content
                document.getElementById('modalTitle').textContent = article.title;
                document.getElementById('modalBody').textContent = article.content;
                document.getElementById('modalMeta').textContent = `${article.date} | ${article.category} | ${article.views} views | ${calculateReadingTime(article.wordCount)} min read`;
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById('articleModal'));
                modal.show();
                // Refresh display to update views
                displayArticles();
            }
        });
    });
};

// Sort articles when selection changes
sortSelect.addEventListener('change', displayArticles);

// Initial display
displayArticles();
