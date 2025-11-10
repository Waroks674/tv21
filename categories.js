const moviesPerPage = 15;
let currentPage = 1;
let currentCategory = 'all';
let allMovies = [];
let originalMovies = []; // Untuk menyimpan data asli sebelum pencarian

// Data kategori yang tersedia
const categories = ['horror', 'drama', 'action', 'comedy', 'kid', 'music', 'documenter', 'discover'];

// Fungsi untuk mendapatkan parameter URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category') || 'all',
        page: parseInt(params.get('page')) || 1
    };
}

// Fungsi untuk memuat film berdasarkan kategori
async function loadMoviesByCategory() {
    try {
        showLoadingState();
        
        const params = getUrlParams();
        currentCategory = params.category;
        currentPage = params.page;

        // Update judul kategori
        updateCategoryTitle();
        
        // Update active category button
        updateActiveCategoryButton();

        if (currentCategory === 'all') {
            // Load dari semua kategori
            await loadAllMovies();
        } else {
            // Load dari kategori tertentu
            await loadCategoryMovies(currentCategory);
        }

        // Simpan salinan asli untuk pencarian
        originalMovies = [...allMovies];
        
        displayMoviesForPage(currentPage);
        setupPagination();
        
    } catch (error) {
        console.error('Error loading movies by category:', error);
        showErrorState('Gagal memuat film. Silakan refresh halaman.');
    }
}

// Fungsi untuk menampilkan loading state
function showLoadingState() {
    const moviesGrid = document.getElementById('movies-grid');
    if (moviesGrid) {
        moviesGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>🎬 Memuat film...</p>
            </div>
        `;
    }
}

// Fungsi untuk menampilkan error state
function showErrorState(message) {
    const moviesGrid = document.getElementById('movies-grid');
    if (moviesGrid) {
        moviesGrid.innerHTML = `
            <div class="loading">
                <p>😞 ${message}</p>
                <button onclick="loadMoviesByCategory()" style="margin-top: 10px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Coba Lagi
                </button>
            </div>
        `;
    }
}

// Fungsi untuk update judul kategori
function updateCategoryTitle() {
    const categoryTitle = document.getElementById('current-category');
    if (categoryTitle) {
        let displayCategory = 'Semua Film';
        if (currentCategory !== 'all') {
            displayCategory = currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1) + ' Movies';
        }
        categoryTitle.textContent = displayCategory;
        
        // Update page title juga
        document.title = `${displayCategory} - INTROMOVIE 21`;
    }
}

// Fungsi untuk update active category button
function updateActiveCategoryButton() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnCategory = btn.getAttribute('href')?.split('category=')[1] || 'all';
        
        if ((currentCategory === 'all' && btn.textContent === 'Semua') || 
            btnCategory === currentCategory) {
            btn.classList.add('active');
        }
    });
}

// Fungsi untuk memuat semua film dari semua kategori
async function loadAllMovies() {
    allMovies = [];
    
    for (const category of categories) {
        try {
            const movies = await fetchMoviesFromCategory(category);
            // Tambahkan kategori ke setiap film
            const moviesWithCategory = movies.map(movie => ({
                ...movie,
                category: category
            }));
            allMovies.push(...moviesWithCategory);
        } catch (error) {
            console.warn(`Could not load ${category}, using demo data`);
            // Fallback ke data demo
            const demoMovies = getDemoMoviesByCategory(category);
            allMovies.push(...demoMovies);
        }
    }
    
    // Jika masih kosong, gunakan data demo komprehensif
    if (allMovies.length === 0) {
        console.log('Using comprehensive demo data for all categories');
        allMovies = getComprehensiveDemoMovies();
    }
    
    console.log(`Loaded ${allMovies.length} movies from all categories`);
}

// Fungsi untuk memuat film dari kategori tertentu
async function loadCategoryMovies(category) {
    try {
        const movies = await fetchMoviesFromCategory(category);
        // Tambahkan kategori ke setiap film
        allMovies = movies.map(movie => ({
            ...movie,
            category: category
        }));
        
        // Jika kosong, gunakan data demo
        if (allMovies.length === 0) {
            console.log(`Using demo data for ${category}`);
            allMovies = getDemoMoviesByCategory(category);
        }
        
        console.log(`Loaded ${allMovies.length} movies from ${category}`);
    } catch (error) {
        console.error(`Error loading ${category} movies:`, error);
        // Fallback ke data demo
        allMovies = getDemoMoviesByCategory(category);
    }
}

// Fungsi untuk mengambil data dari file JSON
async function fetchMoviesFromCategory(category) {
    try {
        const response = await fetch(`data/${category}.json`);
        if (!response.ok) throw new Error(`Failed to fetch ${category}.json`);
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${category} movies:`, error);
        return [];
    }
}

// Fungsi untuk data demo komprehensif
function getComprehensiveDemoMovies() {
    return [
        // Horror
        { title: "The Matriarch 2024", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=The+Matriarch", film_url: "detail.html?film=the-matriarch", genre: "Horror", year: "2024", category: "horror" },
        { title: "Ghost House", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Ghost+House", film_url: "detail.html?film=ghost-house", genre: "Horror", year: "2023", category: "horror" },
        { title: "Dark Night", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Dark+Night", film_url: "detail.html?film=dark-night", genre: "Horror", year: "2023", category: "horror" },
        
        // Drama
        { title: "Drama Story 2024", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Drama+Story", film_url: "detail.html?film=drama-story", genre: "Drama", year: "2024", category: "drama" },
        { title: "Love Forever", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Love+Forever", film_url: "detail.html?film=love-forever", genre: "Drama", year: "2023", category: "drama" },
        { title: "Broken Heart", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Broken+Heart", film_url: "detail.html?film=broken-heart", genre: "Drama", year: "2023", category: "drama" },
        
        // Action
        { title: "Action Hero 2024", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Action+Hero", film_url: "detail.html?film=action-hero", genre: "Action", year: "2024", category: "action" },
        { title: "Fast Pursuit", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Fast+Pursuit", film_url: "detail.html?film=fast-pursuit", genre: "Action", year: "2023", category: "action" },
        { title: "Final Battle", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Final+Battle", film_url: "detail.html?film=final-battle", genre: "Action", year: "2023", category: "action" },
        
        // Comedy
        { title: "Funny Times", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Funny+Times", film_url: "detail.html?film=funny-times", genre: "Comedy", year: "2024", category: "comedy" },
        { title: "Laugh Out Loud", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Laugh+Out+Loud", film_url: "detail.html?film=laugh-out-loud", genre: "Comedy", year: "2023", category: "comedy" },
        { title: "Comedy Night", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Comedy+Night", film_url: "detail.html?film=comedy-night", genre: "Comedy", year: "2023", category: "comedy" },
        
        // Kid
        { title: "Kids Adventure", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Kids+Adventure", film_url: "detail.html?film=kids-adventure", genre: "Animation", year: "2024", category: "kid" },
        { title: "Magic World", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Magic+World", film_url: "detail.html?film=magic-world", genre: "Animation", year: "2023", category: "kid" },
        
        // Music
        { title: "Music Dreams", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Music+Dreams", film_url: "detail.html?film=music-dreams", genre: "Music", year: "2024", category: "music" },
        { title: "Rock Star", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Rock+Star", film_url: "detail.html?film=rock-star", genre: "Music", year: "2023", category: "music" },
        
        // Documenter
        { title: "Wild Nature", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Wild+Nature", film_url: "detail.html?film=wild-nature", genre: "Documentary", year: "2024", category: "documenter" },
        { title: "Ocean Life", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Ocean+Life", film_url: "detail.html?film=ocean-life", genre: "Documentary", year: "2023", category: "documenter" },
        
        // Discover
        { title: "Hidden Gem", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Hidden+Gem", film_url: "detail.html?film=hidden-gem", genre: "Mystery", year: "2024", category: "discover" },
        { title: "Unknown World", thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Unknown+World", film_url: "detail.html?film=unknown-world", genre: "Sci-Fi", year: "2023", category: "discover" }
    ];
}

// Fungsi untuk data demo per kategori
function getDemoMoviesByCategory(category) {
    const allMovies = getComprehensiveDemoMovies();
    return allMovies.filter(movie => movie.category === category);
}

// Fungsi untuk menampilkan film per halaman
function displayMoviesForPage(page) {
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToShow = allMovies.slice(startIndex, endIndex);
    
    displayMovies(moviesToShow, 'movies-grid');
}

// Fungsi untuk membuat elemen movie card
function createMovieCard(movie) {
    if (!movie) return '';
    
    return `
        <div class="movie-card" data-category="${movie.category || ''}">
            <a href="detail.html?film=${encodeURIComponent(movie.film_url || '')}&title=${encodeURIComponent(movie.title || '')}">
                <div class="movie-poster-container">
                    <img src="${movie.thumbnail || 'https://via.placeholder.com/300x533/1f1f1f/8c8c8c?text=No+Image'}" 
                         alt="${movie.title || 'No Title'}" 
                         class="movie-poster"
                         onerror="this.src='https://via.placeholder.com/300x533/1f1f1f/8c8c8c?text=No+Image'">
                </div>
            </a>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title || 'Untitled'}</h3>
                <div class="movie-meta">
                    <span>${movie.genre || 'Unknown'}</span>
                    <span class="movie-year">${movie.year || 'N/A'}</span>
                </div>
            </div>
        </div>
    `;
}

// Fungsi untuk menampilkan film di container
function displayMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container #${containerId} not found`);
        return;
    }
    
    if (!movies || movies.length === 0) {
        container.innerHTML = '<div class="loading"><p>😞 Tidak ada film yang ditemukan</p></div>';
        return;
    }
    
    container.innerHTML = movies.map(movie => createMovieCard(movie)).join('');
}

// Fungsi untuk setup pagination
function setupPagination() {
    const totalPages = Math.ceil(allMovies.length / moviesPerPage);
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer) {
        console.error('Pagination container not found');
        return;
    }
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="pagination-btn">
            ← Sebelumnya
        </button>
        
        <span class="pagination-info">
            Halaman ${currentPage} dari ${totalPages}
        </span>
        
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="pagination-btn">
            Selanjutnya →
        </button>
    `;

    // Tambahkan page numbers untuk navigasi yang lebih baik
    if (totalPages > 2) {
        let pageNumbers = '';
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers += `
                <button onclick="changePage(${i})" class="pagination-btn ${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        }
        
        paginationHTML = `
            <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} class="pagination-btn">
                ← Prev
            </button>
            ${pageNumbers}
            <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} class="pagination-btn">
                Next →
            </button>
        `;
    }

    paginationContainer.innerHTML = paginationHTML;
}

// Fungsi untuk mengganti halaman
function changePage(newPage) {
    const totalPages = Math.ceil(allMovies.length / moviesPerPage);
    
    if (newPage < 1 || newPage > totalPages) {
        return;
    }
    
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage);
    
    // Update URL tanpa reload halaman (untuk UX yang lebih baik)
    window.history.pushState({}, '', `?${params.toString()}`);
    
    currentPage = newPage;
    displayMoviesForPage(currentPage);
    setupPagination();
    
    // Scroll ke atas untuk melihat hasil
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setup search yang diperbaiki
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) {
        console.warn('Search elements not found');
        return;
    }
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            // Reset ke data asli jika query kosong
            allMovies = [...originalMovies];
            currentPage = 1;
            displayMoviesForPage(currentPage);
            setupPagination();
            return;
        }
        
        showLoadingState();
        
        // Gunakan setTimeout untuk memberikan feedback visual
        setTimeout(() => {
            const filteredMovies = originalMovies.filter(movie => {
                const searchableText = `
                    ${movie.title || ''}
                    ${movie.genre || ''}
                    ${movie.description || ''}
                    ${movie.category || ''}
                    ${movie.year || ''}
                `.toLowerCase();
                
                return searchableText.includes(query);
            });
            
            allMovies = filteredMovies;
            currentPage = 1;
            
            if (filteredMovies.length === 0) {
                showErrorState(`Tidak ditemukan film untuk "${query}"`);
            } else {
                displayMoviesForPage(currentPage);
                setupPagination();
                
                // Update judul untuk menunjukkan hasil pencarian
                const categoryTitle = document.getElementById('current-category');
                if (categoryTitle) {
                    categoryTitle.textContent = `Hasil Pencarian: "${query}" (${filteredMovies.length} film)`;
                }
            }
        }, 300);
    }
    
    // Reset pencarian ketika input dikosongkan
    searchInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            allMovies = [...originalMovies];
            currentPage = 1;
            displayMoviesForPage(currentPage);
            setupPagination();
            updateCategoryTitle();
        }
    });
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        this.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    // Tutup mobile menu ketika klik di luar
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        }
    });
    
    // Tutup mobile menu ketika link diklik
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    loadMoviesByCategory();
});

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    console.log('INTROMOVIE 21 - Categories Page Initializing...');
    loadMoviesByCategory();
    setupSearch();
    setupMobileMenu();
});