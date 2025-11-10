// Data kategori yang tersedia
const categories = ['horror', 'drama', 'action', 'comedy', 'kid', 'music', 'documenter', 'discover'];

// Variabel global untuk menyimpan semua film
let allMovies = [];

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

// Fungsi untuk memuat SEMUA film dari SEMUA kategori
async function loadAllMovies() {
    try {
        console.log('Loading all movies from all categories...');
        allMovies = [];
        
        for (const category of categories) {
            try {
                const movies = await fetchMoviesFromCategory(category);
                console.log(`Loaded ${movies.length} movies from ${category}`);
                
                // Tambahkan kategori ke setiap film
                const moviesWithCategory = movies.map(movie => ({
                    ...movie,
                    category: category
                }));
                
                allMovies.push(...moviesWithCategory);
            } catch (error) {
                console.warn(`Could not load ${category}, using demo data`);
                // Fallback data jika file JSON tidak ada
                const demoMovies = getDemoMovies(category);
                allMovies.push(...demoMovies);
            }
        }
        
        // Jika masih kosong, gunakan demo data yang lebih banyak
        if (allMovies.length === 0) {
            console.log('Using comprehensive demo data');
            categories.forEach(category => {
                allMovies.push(...getComprehensiveDemoMovies(category));
            });
        }
        
        console.log(`Total movies loaded: ${allMovies.length}`);
        return allMovies;
        
    } catch (error) {
        console.error('Error loading all movies:', error);
        // Fallback ke demo data komprehensif
        return getComprehensiveDemoMovies();
    }
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

// Fungsi untuk mengambil film acak dari semua kategori
async function loadRandomMovies() {
    try {
        console.log('Loading random movies...');
        
        // Gunakan semua film yang sudah dimuat
        const moviesToUse = allMovies.length > 0 ? allMovies : await loadAllMovies();
        
        // Acak urutan film
        const shuffledMovies = [...moviesToUse].sort(() => Math.random() - 0.5);
        
        // Tampilkan film
        displayMovies(shuffledMovies.slice(0, 8), 'featured-movies');
        displayMovies(shuffledMovies.slice(8, 16), 'trending-movies');
        
    } catch (error) {
        console.error('Error loading random movies:', error);
        // Fallback ke demo data
        const demoMovies = getComprehensiveDemoMovies();
        displayMovies(demoMovies.slice(0, 8), 'featured-movies');
        displayMovies(demoMovies.slice(8, 16), 'trending-movies');
    }
}

// Fungsi untuk data demo komprehensif
function getComprehensiveDemoMovies(category = 'all') {
    const allDemoMovies = [
        // Horror
        {
            title: "The Matriarch 2024",
            description: "Film horror terbaru dengan cerita menegangkan",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=The+Matriarch",
            film_url: "detail.html?film=the-matriarch",
            genre: "Horror",
            year: "2024",
            category: "horror"
        },
        {
            title: "Ghost House",
            description: "Rumah berhantu yang misterius",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Ghost+House",
            film_url: "detail.html?film=ghost-house",
            genre: "Horror",
            year: "2023",
            category: "horror"
        },
        // Action
        {
            title: "Action Hero 2024",
            description: "Film aksi penuh adrenalin",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Action+Hero",
            film_url: "detail.html?film=action-hero",
            genre: "Action",
            year: "2024",
            category: "action"
        },
        {
            title: "Fast Pursuit",
            description: "Kejar-kejaran seru di jalanan",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Fast+Pursuit",
            film_url: "detail.html?film=fast-pursuit",
            genre: "Action",
            year: "2023",
            category: "action"
        },
        // Drama
        {
            title: "Drama Story 2024",
            description: "Film drama mengharukan",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Drama+Story",
            film_url: "detail.html?film=drama-story",
            genre: "Drama",
            year: "2024",
            category: "drama"
        },
        {
            title: "Love Forever",
            description: "Kisah cinta abadi",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Love+Forever",
            film_url: "detail.html?film=love-forever",
            genre: "Drama",
            year: "2023",
            category: "drama"
        },
        // Comedy
        {
            title: "Funny Times",
            description: "Film komedi lucu",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Funny+Times",
            film_url: "detail.html?film=funny-times",
            genre: "Comedy",
            year: "2024",
            category: "comedy"
        },
        {
            title: "Laugh Out Loud",
            description: "Tertawa terbahak-bahak",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Laugh+Out+Loud",
            film_url: "detail.html?film=laugh-out-loud",
            genre: "Comedy",
            year: "2023",
            category: "comedy"
        },
        // Kid
        {
            title: "Kids Adventure",
            description: "Petualangan seru untuk anak",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Kids+Adventure",
            film_url: "detail.html?film=kids-adventure",
            genre: "Animation",
            year: "2024",
            category: "kid"
        },
        // Music
        {
            title: "Music Dreams",
            description: "Mengejar impian di dunia musik",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Music+Dreams",
            film_url: "detail.html?film=music-dreams",
            genre: "Music",
            year: "2024",
            category: "music"
        }
    ];
    
    if (category === 'all') {
        return allDemoMovies;
    }
    
    return allDemoMovies.filter(movie => movie.category === category);
}

// Fungsi untuk data demo (legacy)
function getDemoMovies(category = 'action') {
    return getComprehensiveDemoMovies(category).slice(0, 3);
}

// FUNGSI PENCARIAN YANG DIPERBAIKI
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (!searchInput || !searchBtn) {
        console.warn('Search elements not found');
        return;
    }
    
    async function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        console.log('Searching for:', query);
        
        if (query.length < 2) {
            showSearchMessage('Masukkan minimal 2 karakter untuk pencarian', 'warning');
            return;
        }
        
        showSearchMessage('🔍 Mencari film...', 'loading');
        
        try {
            // Pastikan semua film sudah dimuat
            const moviesToSearch = allMovies.length > 0 ? allMovies : await loadAllMovies();
            
            // Lakukan pencarian yang lebih komprehensif
            const filteredMovies = moviesToSearch.filter(movie => {
                const searchableText = `
                    ${movie.title || ''}
                    ${movie.genre || ''}
                    ${movie.description || ''}
                    ${movie.category || ''}
                    ${movie.year || ''}
                `.toLowerCase();
                
                return searchableText.includes(query);
            });
            
            console.log(`Found ${filteredMovies.length} movies for query: "${query}"`);
            
            if (filteredMovies.length === 0) {
                showSearchMessage(`😞 Tidak ditemukan film untuk "${query}"`, 'error');
                // Kembalikan ke tampilan semula setelah 2 detik
                setTimeout(() => {
                    loadRandomMovies();
                    clearSearchMessage();
                }, 2000);
            } else {
                showSearchMessage(`🎬 Ditemukan ${filteredMovies.length} film untuk "${query}"`, 'success');
                displayMovies(filteredMovies, 'featured-movies');
                
                // Kosongkan trending section
                const trendingContainer = document.getElementById('trending-movies');
                if (trendingContainer) {
                    trendingContainer.innerHTML = `
                        <div class="loading">
                            <p>🔍 Menampilkan hasil pencarian di atas</p>
                        </div>
                    `;
                }
                
                // Update judul section
                updateSectionTitle('featured-movies', `Hasil Pencarian: "${query}"`);
            }
            
        } catch (error) {
            console.error('Search error:', error);
            showSearchMessage('Error saat mencari film', 'error');
        }
    }
    
    // Fungsi untuk menampilkan pesan pencarian
    function showSearchMessage(message, type = 'info') {
        // Hapus pesan sebelumnya
        clearSearchMessage();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `search-message search-message-${type}`;
        messageDiv.innerHTML = `
            <div style="text-align: center; padding: 20px; margin: 20px 0; 
                       background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : type === 'warning' ? '#ffaa00' : '#4444ff'}; 
                       color: white; border-radius: 8px;">
                ${message}
            </div>
        `;
        
        const featuredContainer = document.getElementById('featured-movies');
        if (featuredContainer) {
            featuredContainer.parentNode.insertBefore(messageDiv, featuredContainer);
        }
        
        // Auto remove setelah 3 detik untuk pesan selain success
        if (type !== 'success') {
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }
    
    function clearSearchMessage() {
        const existingMessage = document.querySelector('.search-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    function updateSectionTitle(containerId, newTitle) {
        const container = document.getElementById(containerId);
        if (container) {
            const sectionHeader = container.closest('section').querySelector('.section-title');
            if (sectionHeader) {
                // Simpan judul asli
                if (!sectionHeader.dataset.originalTitle) {
                    sectionHeader.dataset.originalTitle = sectionHeader.textContent;
                }
                sectionHeader.textContent = newTitle;
            }
        }
    }
    
    // Reset pencarian ketika input dikosongkan
    searchInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            clearSearchMessage();
            const featuredTitle = document.querySelector('#featured-movies')?.closest('section')?.querySelector('.section-title');
            if (featuredTitle && featuredTitle.dataset.originalTitle) {
                featuredTitle.textContent = featuredTitle.dataset.originalTitle;
            }
            loadRandomMovies();
        }
    });
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

// Fungsi untuk mobile menu
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

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log('INTROMOVIE 21 - Initializing...');
    
    // Setup mobile menu pertama
    setupMobileMenu();
    
    // Setup search
    setupSearch();
    
    // Load all movies terlebih dahulu
    loadAllMovies().then(() => {
        console.log('All movies loaded successfully');
        // Load random movies untuk tampilan awal
        loadRandomMovies();
    }).catch(error => {
        console.error('Failed to load movies:', error);
        // Fallback ke random movies dengan data demo
        loadRandomMovies();
    });
    
    // Add loading state
    const containers = ['featured-movies', 'trending-movies'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>🎬 Memuat film...</p>
                </div>
            `;
        }
    });
});