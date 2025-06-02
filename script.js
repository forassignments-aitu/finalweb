document.addEventListener('DOMContentLoaded', function() {
    let articles = [];
    const articlesContainer = document.getElementById('articles-container');
    const mostPopularContainer = document.getElementById('most-popular');
    const sortSelect = document.getElementById('sortSelect');
    const themeToggle = document.getElementById('themeToggle');
    const totalArticlesEl = document.getElementById('total-articles');
    const totalViewsEl = document.getElementById('total-views');

    // json download
    fetch('articles.json')
        .then(response => response.json())
        .then(data => {
            articles = data.articles;
            renderArticles(articles);
            updateMostPopular();
            updateStats();
            populateCategories();
        })
        .catch(error => console.error('Error loading articles:', error));

    // rendering of articles
    function renderArticles(articlesToRender) {
        articlesContainer.innerHTML = '';

        articlesToRender.forEach(article => {
            const readingTime = Math.ceil(article.wordCount / 200);

            const articleCard = `
                <div class="col-md-6 mb-4">
                    <div class="card article-card h-100">
                        <div class="position-relative">
                            <img src="https://picsum.photos/seed/${article.id}/600/400" class="card-img-top" alt="${article.title}">
                            <span class="badge bg-primary category-badge">${article.category}</span>
                            <span class="reading-time">${readingTime} min read</span>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${article.title}</h5>
                            <p class="card-text">${article.content.substring(0, 100)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">${formatDate(article.date)}</small>
                                <span class="badge bg-info">👁️ ${article.views}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            articlesContainer.innerHTML += articleCard;
        });
    }

    // formating of date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // update the most popular
    function updateMostPopular() {
        if (articles.length === 0) return;

        const popularArticle = [...articles].sort((a, b) => b.views - a.views)[0];
        const readingTime = Math.ceil(popularArticle.wordCount / 200);

        mostPopularContainer.innerHTML = `
            <h6>${popularArticle.title}</h6>
            <p class="mb-1"><small>${formatDate(popularArticle.date)}</small></p>
            <p class="text-truncate">${popularArticle.content.substring(0, 80)}...</p>
            <div class="d-flex justify-content-between">
                <span class="badge bg-primary">${popularArticle.category}</span>
                <span>👁️ ${popularArticle.views} | ⏱️ ${readingTime} min</span>
            </div>
        `;
    }

    // update stats
    function updateStats() {
        totalArticlesEl.textContent = articles.length;

        const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
        totalViewsEl.textContent = totalViews;
    }

    // fulling categories
    function populateCategories() {
        const categoriesMenu = document.getElementById('categories-menu');
        const categories = [...new Set(articles.map(article => article.category))];

        categories.forEach(category => {
            const li = document.createElement('li');
            li.innerHTML = `<a class="dropdown-item" href="#">${category}</a>`;
            categoriesMenu.appendChild(li);
        });
    }

    // sorts articles
    sortSelect.addEventListener('change', function() {
        const sortedArticles = [...articles];

        if (this.value === 'date') {
            sortedArticles.sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            );
        } else if (this.value === 'popularity') {
            sortedArticles.sort((a, b) => b.views - a.views);
        }

        renderArticles(sortedArticles);
    });

    //switch theme
    themeToggle.addEventListener('change', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // checking the saved theme
    function loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            themeToggle.checked = savedTheme === 'dark';
        }
    }

    // initialization
    loadSavedTheme();
});